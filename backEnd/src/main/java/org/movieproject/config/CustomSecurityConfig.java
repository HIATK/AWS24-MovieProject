package org.movieproject.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.config.Filter.APILoginFilter;
import org.movieproject.config.Filter.RefreshTokenFilter;
import org.movieproject.config.Filter.TokenCheckFilter;
import org.movieproject.config.handler.APILoginFailureHandler;
import org.movieproject.config.handler.APILoginSuccessHandler;
import org.movieproject.config.handler.Custom403Handler;
import org.movieproject.config.handler.MvpSocialLoginSuccessHandler;
import org.movieproject.security.JwtProvider;
import org.movieproject.security.MvpUserDetailsService;
import org.movieproject.security.util.JwtLoginUtil;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.List;

@Log4j2
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class CustomSecurityConfig {

    private final DataSource dataSource;
    private final MvpUserDetailsService mvpUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final JwtLoginUtil jwtLoginUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        log.info("--------------------configure-------------------");

        http
            .cors(cors -> {
                CorsConfigurationSource source = corsConfigurationSource();
                cors.configurationSource(source);
            })
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(httpSecuritySessionManagementConfigurer ->   // 세션 비활성화
                    httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize // 권한 설정
                    .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                    .anyRequest().permitAll()
                    )
//                .formLogin(form ->{form.loginPage("/login") // 로그인 설정
//                        .loginProcessingUrl("/login/auth")
//                        .successHandler(apiLoginSuccessHandler())
//                        .permitAll();
//                })
            .oauth2Login(httpSecurityOauth2LoginConfigurer -> { // 소셜 로그인 설정
                httpSecurityOauth2LoginConfigurer.loginPage("/member/login")
                        .successHandler(mvpSocialLoginSuccessHandler());
            })
            .logout(logout -> logout    // 로그아웃 설정
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .permitAll()
            );


        // 인 증 매 니 저 설 정
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(mvpUserDetailsService)
                .passwordEncoder(passwordEncoder);

        // 매 니 저 가 져 오 기
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();
        // 인 증 매 니 저 등 록
        http.authenticationManager(authenticationManager);
        // API 로 그 인 필 터 설 정
        APILoginFilter apiLoginFilter = new APILoginFilter("/api/login");

        apiLoginFilter.setAuthenticationManager(authenticationManager);
        // APILoginFilter 위치 조정 - UsernamePasswordAuthenticationFilter 이전에 동작해야함
        http.addFilterBefore(apiLoginFilter, UsernamePasswordAuthenticationFilter.class);
        // APILoginSuccessHandler
        APILoginSuccessHandler successHandler = new APILoginSuccessHandler(jwtLoginUtil);
        // SuccessHandler 설정
        apiLoginFilter.setAuthenticationSuccessHandler(successHandler);

        APILoginFailureHandler failureHandler = new APILoginFailureHandler();

        apiLoginFilter.setAuthenticationFailureHandler(failureHandler);
        // 토큰 체크 필터
        http.addFilterBefore(tokenCheckFilter(jwtProvider, mvpUserDetailsService), UsernamePasswordAuthenticationFilter.class);
        // 리프레시 토큰 필터
        http.addFilterBefore(new RefreshTokenFilter("/api/member/check_auth/refresh", jwtProvider), TokenCheckFilter.class);

        // remember-me 설정
        http.rememberMe(httpSecurityRememberMeConfigurer -> {
            httpSecurityRememberMeConfigurer.key("123456789")
                    .tokenRepository(persistentTokenRepository())
                    .userDetailsService(mvpUserDetailsService)
                    .tokenValiditySeconds(60*5);     // 5분
        });


        http.exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
            httpSecurityExceptionHandlingConfigurer.accessDeniedHandler(accessDeniedHandler());
        });

        return http.build();
    }

    @Bean   // 자동로그인 관련
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcTokenRepositoryImpl repo = new JdbcTokenRepositoryImpl();
        repo.setDataSource(dataSource);

        return repo;
    }

    @Bean   // 정적 리소스 필터링 제외
    public WebSecurityCustomizer webSecurityCustomizer() {
        log.info("-------------------- web configure  -------------------");

        return (web -> web.ignoring().requestMatchers(PathRequest.toStaticResources()
                .atCommonLocations()));
    }

    @Bean   // 엑세스 디나이드 핸들러
    public AccessDeniedHandler accessDeniedHandler() {

        return new Custom403Handler();
    }

    @Bean
    public AuthenticationSuccessHandler apiLoginSuccessHandler() {
        return new APILoginSuccessHandler(jwtLoginUtil);
    }

    @Bean
    public AuthenticationSuccessHandler mvpSocialLoginSuccessHandler() {
        return new MvpSocialLoginSuccessHandler(jwtLoginUtil);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // 허용할 도메인
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // 자격 증명 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Token Check Filter 생성
    private TokenCheckFilter tokenCheckFilter(JwtProvider jwtProvider, MvpUserDetailsService mvpUserDetailsService) {
        return new TokenCheckFilter(jwtProvider, mvpUserDetailsService);
    }
}
