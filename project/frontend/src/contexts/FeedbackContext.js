"use client"

import { createContext, useContext, useState } from "react"
import { feedbackService } from "../services/feedbackService"

const FeedbackContext = createContext(null)

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFeedbacks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await feedbackService.getFeedbacks()
      setFeedbacks(data)
    } catch (err) {
      console.error(" Error fetching feedbacks:", err)
      setError(err.message)
      // Keep empty array on error
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const addFeedback = async (feedback) => {
    try {
      const newFeedback = await feedbackService.createFeedback(feedback)
      setFeedbacks((prev) => [newFeedback, ...prev])
      return newFeedback
    } catch (err) {
      console.error(" Error adding feedback:", err)
      throw err
    }
  }

  const markAsRead = async (feedbackId) => {
    try {
      await feedbackService.markAsRead(feedbackId)
      setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, read: true } : f)))
    } catch (err) {
      console.error(" Error marking feedback as read:", err)
      throw err
    }
  }

  const getFeedbacksByAthlete = (athleteId) => {
    return feedbacks.filter((f) => f.athleteId === athleteId)
  }

  const getUnreadCount = () => {
    return feedbacks.filter((f) => !f.read).length
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
