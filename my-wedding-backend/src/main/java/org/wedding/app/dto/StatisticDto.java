package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record StatisticDto(
        @JsonProperty("wedding_id")
        Integer weddingId,
        @JsonProperty("event_id")
        Integer eventId,
        @JsonProperty("invitations")
        Long invitations,
        @JsonProperty("confirmed")
        Long confirmed,
        @JsonProperty("declined")
        Long declined,
        @JsonProperty("waiting")
        Long waiting,
        @JsonProperty("people_confirmed")
        Long peopleConfirmed,
        @JsonProperty("people_declined")
        Long peopleDeclined,
        @JsonProperty("people_waiting")
        Long peopleWaiting,
        @JsonProperty("updated_at")
        LocalDateTime updatedAt
) {
    public StatisticDto(Integer weddingId, Long invitations, Long confirmed, Long declined,
                        Long waiting, Long peopleConfirmed, Long peopleDeclined, Long peopleWaiting) {
        this(weddingId, 0, invitations, confirmed, declined, waiting, peopleConfirmed, peopleDeclined, peopleWaiting, null);

    }

    public StatisticDto(Integer weddingId, Integer eventId, Integer invitations, Integer confirmed, Integer declined,
                        Integer waiting, Integer peopleConfirmed, Integer peopleDeclined, Integer peopleWaiting) {
        this(weddingId, eventId, (long) invitations, (long) confirmed, (long) declined, (long) waiting, (long) peopleConfirmed,
                (long) peopleDeclined, (long) peopleWaiting, null);

    }
}
