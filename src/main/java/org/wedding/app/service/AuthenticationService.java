package org.wedding.app.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.wedding.app.dto.AuthenticationResponse;
import org.wedding.app.dto.UsernamePassword;

public interface AuthenticationService {

    AuthenticationResponse authenticate(UsernamePassword usernamePassword);

    AuthenticationResponse refreshToken(HttpServletRequest request);
}
