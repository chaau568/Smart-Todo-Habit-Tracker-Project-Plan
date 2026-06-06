function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
  return match ? match.split("=")[1] : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export const auth = {
  setTokens: (access: string, refresh: string) => {
    setCookie("access_token", access, 30 * 60)
    setCookie("refresh_token", refresh, 7 * 24 * 60 * 60)
  },
  clearTokens: () => {
    deleteCookie("access_token")
    deleteCookie("refresh_token")
  },
  getAccessToken: () => getCookie("access_token"),
  getRefreshToken: () => getCookie("refresh_token"),
  isAuthenticated: () => !!getCookie("access_token"),
}
