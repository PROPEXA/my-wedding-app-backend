import {
  Component,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GOOGLE_MAPS } from '../../../../core/env/env.dev';

/** Interfaz para las coordenadas de ubicación */
export interface LocationCoordinates {
  latitude: string;
  longitude: string;
  address?: string;
}

declare const google: any;

@Component({
  selector: 'app-location-picker',
  imports: [],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPicker),
      multi: true,
    },
  ],
})
export class LocationPicker implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  /** Label del campo */
  label = input<string>('Ubicación');

  /** Placeholder del buscador */
  placeholder = input<string>('Busca una dirección...');

  /** Indica si el campo es requerido */
  required = input<boolean>(false);

  /** Mensaje de error a mostrar */
  errorMessage = input<string>('');

  /** ID del componente para accesibilidad */
  locationPickerId = input<string>('');

  /** Latitud inicial (por defecto Ciudad de México) */
  initialLat = input<number>(19.4326);

  /** Longitud inicial (por defecto Ciudad de México) */
  initialLng = input<number>(-99.1332);

  /** Zoom inicial del mapa */
  initialZoom = input<number>(13);

  /** Emite cuando cambian las coordenadas */
  locationChange = output<LocationCoordinates>();

  /** Coordenadas actuales */
  protected coordinates = signal<LocationCoordinates>({ latitude: '', longitude: '' });

  /** Dirección actual */
  protected currentAddress = signal<string>('');

  /** Estado de carga del mapa */
  protected isLoading = signal<boolean>(true);

  /** Error al cargar el mapa */
  protected mapError = signal<string | null>(null);

  /** Estado de deshabilitado */
  protected isDisabled = signal<boolean>(false);

  /** Estado de touched */
  protected isTouched = signal<boolean>(false);

  /** Estado de carga de geolocalización */
  protected isGeolocating = signal<boolean>(false);

  /** Si la geolocalización está disponible */
  protected geolocationAvailable = signal<boolean>(false);

  /** Referencia al mapa de Google */
  private map: any = null;

  /** Referencia al marcador */
  private marker: any = null;

  /** Referencia al autocomplete */
  private autocomplete: any = null;

  /** Callbacks para ControlValueAccessor */
  private onChange: (value: LocationCoordinates) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.loadGoogleMapsScript();
    this.checkGeolocationAvailability();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializa después de que el script de Google Maps se carga
  }

  ngOnDestroy(): void {
    // Limpiar listeners si existen
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTROL VALUE ACCESSOR
  // ═══════════════════════════════════════════════════════════════════════════

  writeValue(value: LocationCoordinates | null): void {
    if (value) {
      this.coordinates.set(value);
      this.currentAddress.set(value.address || '');

      // Si el mapa ya está inicializado, actualizar la posición
      if (this.map && value.latitude && value.longitude) {
        const lat = parseFloat(value.latitude);
        const lng = parseFloat(value.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const position = { lat, lng };
          this.map.setCenter(position);
          this.marker?.setPosition(position);
        }
      }
    }
  }

  registerOnChange(fn: (value: LocationCoordinates) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Carga el script de Google Maps de forma dinámica
   */
  private loadGoogleMapsScript(): void {
    // Verificar si ya está cargado
    if (typeof google !== 'undefined' && google.maps) {
      this.initMap();
      return;
    }

    // Verificar si el script ya existe
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      // Si el script existe, verificar si ya terminó de cargar
      if (typeof google !== 'undefined' && google.maps) {
        this.initMap();
      } else {
        // Esperar a que termine de cargar
        existingScript.addEventListener('load', () => this.initMap());
      }
      return;
    }

    // Crear y agregar el script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS.apiKey}&libraries=places&callback=Function.prototype`;
    script.async = true;
    script.defer = true;

    script.onload = () => this.initMap();
    script.onerror = () => {
      this.isLoading.set(false);
      this.mapError.set('Error al cargar Google Maps. Verifica tu API Key.');
    };

    document.head.appendChild(script);
  }

  /**
   * Inicializa el mapa de Google
   */
  private initMap(): void {
    if (!this.mapContainer?.nativeElement) {
      // Si el contenedor no está listo, esperar un momento
      setTimeout(() => this.initMap(), 100);
      return;
    }

    try {
      const coords = this.coordinates();
      const lat = coords.latitude ? parseFloat(coords.latitude) : this.initialLat();
      const lng = coords.longitude ? parseFloat(coords.longitude) : this.initialLng();

      // Crear el mapa
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: { lat, lng },
        zoom: this.initialZoom(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Crear el marcador
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        draggable: !this.isDisabled(),
        animation: google.maps.Animation.DROP,
      });

      // TODO: Habilitar cuando se active Places API (New)
      // this.setupAutocomplete();

      // Listeners
      this.marker.addListener('dragend', () => this.onMarkerDragEnd());
      this.map.addListener('click', (e: any) => this.onMapClick(e));

      this.isLoading.set(false);

      // Si hay coordenadas iniciales, obtener la dirección
      if (coords.latitude && coords.longitude) {
        this.reverseGeocode(lat, lng);
      }
    } catch (error) {
      this.isLoading.set(false);
      this.mapError.set('Error al inicializar el mapa.');
    }
  }

  /**
   * Configura el autocomplete para búsqueda de direcciones usando PlaceAutocompleteElement
   */
  private setupAutocomplete(): void {
    if (!this.searchInput?.nativeElement) return;

    // Crear el elemento PlaceAutocompleteElement
    this.autocomplete = new google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: ['mx', 'us', 'es'] }, // Puedes ajustar los países
    });

    // Aplicar estilos al elemento
    this.autocomplete.style.width = '100%';
    this.autocomplete.style.height = '100%';

    // Reemplazar el input con el PlaceAutocompleteElement
    const container = this.searchInput.nativeElement.parentElement;
    if (container) {
      this.searchInput.nativeElement.style.display = 'none';
      container.appendChild(this.autocomplete);
    }

    // Escuchar el evento de selección de lugar
    this.autocomplete.addEventListener('gmp-placeselect', async (event: any) => {
      const place = event.place;

      try {
        // Obtener los campos necesarios
        await place.fetchFields({ fields: ['location', 'formattedAddress'] });

        if (place.location) {
          const lat = place.location.lat();
          const lng = place.location.lng();

          this.map.setCenter({ lat, lng });
          this.map.setZoom(17);
          this.marker.setPosition({ lat, lng });

          this.updateCoordinates(lat, lng, place.formattedAddress || '');
        }
      } catch (error) {
        console.error('Error al obtener detalles del lugar:', error);
      }
    });
  }

  /**
   * Handler cuando se arrastra el marcador
   */
  private onMarkerDragEnd(): void {
    const position = this.marker.getPosition();
    const lat = position.lat();
    const lng = position.lng();

    this.reverseGeocode(lat, lng);
  }

  /**
   * Handler cuando se hace click en el mapa
   */
  private onMapClick(event: any): void {
    if (this.isDisabled()) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.marker.setPosition({ lat, lng });
    this.reverseGeocode(lat, lng);
  }

  /**
   * Obtiene la dirección a partir de coordenadas usando la API REST de Geocoding
   */
  private reverseGeocode(lat: number, lng: number): void {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS.geocodingApiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK' && data.results[0]) {
          this.updateCoordinates(lat, lng, data.results[0].formatted_address);
        } else {
          this.updateCoordinates(lat, lng, '');
        }
      })
      .catch(() => {
        this.updateCoordinates(lat, lng, '');
      });
  }

  /**
   * Actualiza las coordenadas y emite el cambio
   */
  private updateCoordinates(lat: number, lng: number, address: string): void {
    const coords: LocationCoordinates = {
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      address,
    };

    this.coordinates.set(coords);
    this.currentAddress.set(address);
    this.onChange(coords);
    this.locationChange.emit(coords);
    this.markAsTouched();
  }

  /**
   * Marca el control como touched
   */
  protected markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  /**
   * Limpia la ubicación seleccionada
   */
  protected clearLocation(): void {
    this.coordinates.set({ latitude: '', longitude: '' });
    this.currentAddress.set('');
    this.onChange({ latitude: '', longitude: '' });

    // Resetear el mapa a la posición inicial
    if (this.map) {
      const lat = this.initialLat();
      const lng = this.initialLng();
      this.map.setCenter({ lat, lng });
      this.map.setZoom(this.initialZoom());
      this.marker.setPosition({ lat, lng });
    }
  }

  /**
   * Verifica si la geolocalización está disponible en el navegador
   */
  private checkGeolocationAvailability(): void {
    this.geolocationAvailable.set('geolocation' in navigator);
  }

  /**
   * Obtiene la ubicación actual del usuario usando geolocalización
   */
  protected getCurrentLocation(): void {
    if (!navigator.geolocation || this.isDisabled()) return;

    this.isGeolocating.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Centrar el mapa y mover el marcador
        if (this.map) {
          this.map.setCenter({ lat, lng });
          this.map.setZoom(17);
          this.marker?.setPosition({ lat, lng });
        }

        // Obtener la dirección y actualizar coordenadas
        this.reverseGeocode(lat, lng);
        this.isGeolocating.set(false);
      },
      (error) => {
        this.isGeolocating.set(false);
        let errorMessage = 'No se pudo obtener la ubicación.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Habilita el acceso en tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'La ubicación no está disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación.';
            break;
        }

        this.mapError.set(errorMessage);
        // Limpiar el error después de 5 segundos
        setTimeout(() => this.mapError.set(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }
}
