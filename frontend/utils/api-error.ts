import { AxiosError } from "axios"

interface ParsedError {
  general: string | null
  fields: Record<string, string>
}

export function parseApiError(error: unknown): ParsedError {
  if (!(error instanceof AxiosError)) {
    return { general: "An unexpected error occurred.", fields: {} }
  }

  if (!error.response?.data) {
    return { general: "Network error. Please check your connection.", fields: {} }
  }

  const { error: apiError } = error.response.data as {
    error?: { code: string; message: string | Record<string, string[]> }
  }

  if (!apiError) {
    return { general: "An unexpected error occurred.", fields: {} }
  }

  const { message } = apiError

  if (typeof message === "string") {
    return { general: message, fields: {} }
  }

  if (typeof message === "object") {
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(message)) {
      fields[key] = Array.isArray(value) ? value[0] : String(value)
    }
    const general = fields["non_field_errors"] ?? null
    if (general) delete fields["non_field_errors"]
    return { general, fields }
  }

  return { general: "An unexpected error occurred.", fields: {} }
}
