const Medicine = require('../models/Medicine');

class NotificationService {
    constructor() {
        this.checkInterval = 60000; // Check every minute
        this.reminderOffset = 600000; // 10 minutes in milliseconds
        this.activeTimers = new Map();
    }

    start() {
        // Start the periodic check
        this.intervalId = setInterval(() => this.checkUpcomingMedicines(), this.checkInterval);
        console.log('✅ Notification service started');
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.activeTimers.clear();
            console.log('🛑 Notification service stopped');
        }
    }

    async checkUpcomingMedicines() {
        try {
            const now = new Date();
            const medicines = await Medicine.find({
                taken: false,
                startDate: { $lte: now },
                endDate: { $gte: now }
            });

            medicines.forEach(medicine => {
                const [hours, minutes] = medicine.frequency.split(':');
                const scheduleTime = new Date();
                scheduleTime.setHours(parseInt(hours));
                scheduleTime.setMinutes(parseInt(minutes));
                scheduleTime.setSeconds(0);

                // If the time has passed for today, schedule for tomorrow
                if (scheduleTime < now) {
                    scheduleTime.setDate(scheduleTime.getDate() + 1);
                }

                const notificationTime = new Date(scheduleTime.getTime() - this.reminderOffset);
                const timeUntilNotification = notificationTime.getTime() - now.getTime();

                // Only schedule if notification time hasn't passed and no timer exists
                if (timeUntilNotification > 0 && !this.activeTimers.has(medicine._id.toString())) {
                    const timerId = setTimeout(() => {
                        this.sendNotification(medicine);
                        this.activeTimers.delete(medicine._id.toString());
                    }, timeUntilNotification);

                    this.activeTimers.set(medicine._id.toString(), timerId);
                }
            });
        } catch (error) {
            console.error('Error checking upcoming medicines:', error);
        }
    }

    sendNotification(medicine) {
        // For now, just log the notification
        // In a real application, this would integrate with a proper notification system
        console.log(`🔔 REMINDER: Time to take ${medicine.name} (${medicine.dosage}) in 10 minutes`);
        // Here you would typically:
        // 1. Send a push notification
        // 2. Send an email
        // 3. Send an SMS
        // 4. Or use any other notification method
    }
}

module.exports = new NotificationService();