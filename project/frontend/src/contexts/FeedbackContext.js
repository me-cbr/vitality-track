"use client"

import { createContext, useContext, useState } from "react"
import { feedbackService } from "../services/feedbackService"
import { USE_MOCKS, mockData } from "../config/mockData"

const FeedbackContext = createContext(null)

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFeedbacks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = USE_MOCKS ? mockData.feedbacks : await feedbackService.getFeedbacks()
      const normalized = data.map((f) => ({
        id: f.id,
        mensagem: f.mensagem || f.message,
        data: f.data || f.date || f.created_at,
        atleta_id: f.atleta_id || f.athlete_id || f.athleteId,
        treinador_id: f.treinador_id || f.coach_id || f.coachId,
        tipo_mensagem: f.tipo_mensagem || f.message_type,
        lido: f.lido || f.read || false,
      }))
      setFeedbacks(normalized)
    } catch (err) {
      console.error("Error fetching feedbacks:", err)
      setError(err.message)
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const addFeedback = async (feedback) => {
    try {
      // Ensure consistent field names when sending
      const feedbackData = {
        mensagem: feedback.mensagem || feedback.message,
        data: feedback.data || new Date().toISOString(),
        atleta_id: feedback.atleta_id || feedback.athlete_id,
        treinador_id: feedback.treinador_id || feedback.coach_id,
        lido: false,
      }
      const newFeedback = await feedbackService.createFeedback(feedbackData)
      const normalized = {
        id: newFeedback.id,
        mensagem: newFeedback.mensagem || newFeedback.message,
        data: newFeedback.data || newFeedback.created_at,
        atleta_id: newFeedback.atleta_id || newFeedback.athlete_id || newFeedback.athleteId,
        treinador_id: newFeedback.treinador_id || newFeedback.coach_id || newFeedback.coachId,
        tipo_mensagem: newFeedback.tipo_mensagem || newFeedback.message_type || feedbackData.tipo_mensagem,
        lido: newFeedback.lido || newFeedback.read || false,
      }
      setFeedbacks((prev) => [normalized, ...prev])
      return newFeedback
    } catch (err) {
      console.error("Error adding feedback:", err)
      throw err
    }
  }

  const markAsRead = async (feedbackId) => {
    try {
      await feedbackService.markAsRead(feedbackId)
      setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, lido: true } : f)))
    } catch (err) {
      console.error("Error marking feedback as read:", err)
      throw err
    }
  }

  const getFeedbacksByAthlete = (athleteId) => {
    return feedbacks.filter((f) => f.atleta_id === athleteId)
  }

  const getUnreadCount = () => {
    return feedbacks.filter((f) => !f.lido).length
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        loading,
        error,
        fetchFeedbacks,
        addFeedback,
        markAsRead,
        getFeedbacksByAthlete,
        getUnreadCount,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider")
  }
  return context
}
