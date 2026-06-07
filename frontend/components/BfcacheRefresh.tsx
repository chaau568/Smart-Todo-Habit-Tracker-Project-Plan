"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

export function BfcacheRefresh() {
  const qc = useQueryClient()

  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        qc.invalidateQueries()
      }
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [qc])

  return null
}
