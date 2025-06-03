import apiClient from './apiClient'

const scheduleService = {
  // Get veterinarian schedule
  async getVetSchedule() {
    try {
      const response = await apiClient.get('/veterinarians/schedule')
      return response.data
    } catch (error) {
      console.error('Error getting vet schedule:', error)
      throw error
    }
  },

  // Update veterinarian schedule
  async updateVetSchedule(scheduleData) {
    try {
      const response = await apiClient.put('/veterinarians/schedule', scheduleData)
      return response.data
    } catch (error) {
      console.error('Error updating vet schedule:', error)
      throw error
    }
  },

  // Get available time slots for a specific date
  async getAvailableSlots(date, duration = 30) {
    try {
      const response = await apiClient.get('/veterinarians/available-slots', {
        params: { date, duration }
      })
      return response.data
    } catch (error) {
      console.error('Error getting available slots:', error)
      throw error
    }
  },

  // Check if veterinarian is available at specific time
  async checkAvailability(dateTime, duration = 30) {
    try {
      const response = await apiClient.get('/veterinarians/check-availability', {
        params: { dateTime, duration }
      })
      return response.data
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  },

  // Get schedule for a specific date range
  async getScheduleByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get('/veterinarians/schedule/range', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      console.error('Error getting schedule by date range:', error)
      throw error
    }
  }
}

export default scheduleService 