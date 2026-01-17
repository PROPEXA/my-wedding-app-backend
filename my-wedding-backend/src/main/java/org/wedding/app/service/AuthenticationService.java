package org.wedding.app.service;

import org.wedding.app.dto.AuthenticationResponse;
import org.wedding.app.dto.UsernamePassword;

public interface AuthenticationService {

    AuthenticationResponse authenticate(UsernamePassword usernamePassword);
}
