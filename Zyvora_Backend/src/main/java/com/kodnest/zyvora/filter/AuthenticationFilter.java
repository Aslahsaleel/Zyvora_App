package com.kodnest.zyvora.filter;

import com.kodnest.zyvora.entity.Role;
import com.kodnest.zyvora.entity.User;
import com.kodnest.zyvora.repository.UserRepository;
import com.kodnest.zyvora.service.AuthService;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@WebFilter(urlPatterns = {"/api/*", "/admin/*"})
@Component
public class AuthenticationFilter implements Filter {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthenticationFilter.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    private static final String ALLOWED_ORIGIN =
            "http://localhost:5174";

    private static final String[] UNAUTHENTICATED_PATHS = {
        "/api/users/register",
        "/api/auth/login"
    };

    public AuthenticationFilter(
            AuthService authService,
            UserRepository userRepository) {

        this.authService = authService;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest =
                (HttpServletRequest) request;

        HttpServletResponse httpResponse =
                (HttpServletResponse) response;

        try {
            executeFilterLogic(
                    httpRequest,
                    httpResponse,
                    chain
            );
        } catch (Exception e) {
            logger.error("Authentication filter error", e);

            if (!httpResponse.isCommitted()) {
                sendErrorResponse(
                        httpResponse,
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "Internal server error"
                );
            }
        }
    }

    private void executeFilterLogic(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

		String requestURI = request.getRequestURI();
		
		logger.info("Request URI: {}", requestURI);
		
		// STEP 1: Add CORS headers
		setCORSHeaders(request, response);
		
		// STEP 2: Handle OPTIONS requests FIRST
		if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
		    return;
		}
		
		// STEP 3: Allow unauthenticated paths
		if (Arrays.asList(UNAUTHENTICATED_PATHS).contains(requestURI)) {
		    chain.doFilter(request, response);
		    return;
		}

        // STEP 4: Extract authentication cookie.
        String token = getAuthTokenFromCookies(request);

        if (token == null || !authService.validateToken(token)) {

            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: Invalid or missing token"
            );
            return;
        }

        // STEP 5: Extract username from token.
        String username = authService.extractUsername(token);

        Optional<User> userOptional =
                userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {

            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: User not found"
            );
            return;
        }

        // STEP 6: Check user role.
        User authenticatedUser = userOptional.get();

        Role role = authenticatedUser.getRole();

        logger.info(
                "Authenticated User: {}, Role: {}",
                authenticatedUser.getUsername(),
                role
        );

        // STEP 7: Admin authorization.
        if (requestURI.startsWith("/admin/")
                && role != Role.ADMIN) {

            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Admin access required"
            );
            return;
        }

        // STEP 8: Customer authorization.
        if (requestURI.startsWith("/api/")
                && role != Role.CUSTOMER) {

            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Customer access required"
            );
            return;
        }

        // STEP 9: Attach authenticated user.
        request.setAttribute(
                "authenticatedUser",
                authenticatedUser
        );

        chain.doFilter(request, response);
    }

    private void setCORSHeaders(
            HttpServletRequest request,
            HttpServletResponse response) {

        String origin = request.getHeader("Origin");

        if (ALLOWED_ORIGIN.equals(origin)) {

            response.setHeader(
                    "Access-Control-Allow-Origin",
                    ALLOWED_ORIGIN
            );

            response.setHeader(
                    "Access-Control-Allow-Credentials",
                    "true"
            );

            response.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS"
            );

            response.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type, Authorization"
            );

            response.setHeader(
                    "Access-Control-Max-Age",
                    "3600"
            );

            response.setHeader(
                    "Vary",
                    "Origin"
            );
        }
    }

    private void sendErrorResponse(
            HttpServletResponse response,
            int statusCode,
            String message)
            throws IOException {

        response.setStatus(statusCode);
        response.setContentType("text/plain");
        response.getWriter().write(message);
    }

    private String getAuthTokenFromCookies(
            HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            return Arrays.stream(cookies)
                    .filter(cookie ->
                            "authToken".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}
