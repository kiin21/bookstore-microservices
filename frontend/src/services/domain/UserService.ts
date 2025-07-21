import keycloak from "../../keycloak";

const isSSO = true;

const initKeycloak = (onAuthenticatedCallback: () => void, logout: () => void) => {
    keycloak.init({
        onLoad: "check-sso",
        enableLogging: true,
        pkceMethod: "S256",
        checkLoginIframe: false,
        flow: "standard",
    })
        .then((authenticated: boolean) => {
            if (!authenticated) {
                if (isSSO) {
                    logout();
                }
            }
            return onAuthenticatedCallback();
        })
        .catch((e) => {
            console.error("Keycloak initialization error:", e);
        });
};

const getKeycloak = () => keycloak;

const doLogin = (redirectUri: string) => keycloak.login({
    redirectUri: redirectUri ? redirectUri : window.location.origin,
    scope: "openid profile email",
});

const doLogout = () => keycloak.logout();

const getToken = (): string | undefined => keycloak.token;

const isLoggedIn = (): boolean => !!keycloak.authenticated;

const getUsername = (): string => keycloak.tokenParsed?.preferred_username || "";

export const UserService = {
    initKeycloak,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    getUsername,
    getKeycloak
};