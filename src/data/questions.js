// Questions grouped by levels
const questions = {
  // Level 1: Simple hour differences (1-3 hours)
  1: [
    {
      id: "1-1",
      template: (data) => `Ako je sada ${data.startHour} sati ${data.startPeriod} i ${data.activity} počinje u ${data.endHour} sati ${data.endPeriod}, koliko sati imaš do tada?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 10) + 1; // 1-10
        const endHour = startHour + Math.floor(Math.random() * 3) + 1; // 1-3 hours later
        const startPeriod = startHour < 12 ? 'ujutro' : 'popodne';
        const endPeriod = endHour < 12 ? 'ujutro' : 'popodne';
        
        const activities = ['škola', 'trening', 'ples', 'glazbena škola', 'igranje'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        return {
          startHour,
          endHour,
          startPeriod,
          endPeriod,
          activity,
          answer: endHour - startHour,
          hint: `Razmisli koliko je sati od ${startHour} do ${endHour}.`,
          answerType: 'hour' // Mark this as requiring only hour
        };
      }
    },
    {
      id: "1-2",
      template: (data) => `Ako ${data.activity} počinje u ${data.startHour} sati i traje ${data.duration} sata, u koliko sati završava?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 10) + 1; // 1-10
        const duration = Math.floor(Math.random() * 2) + 1; // 1-2 hours
        const endHour = (startHour + duration) % 12 || 12;
        
        const activities = ['nastava', 'sport', 'crtanje', 'čitanje', 'igranje'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        return {
          startHour,
          duration,
          activity,
          answer: endHour,
          hint: `Dodaj ${duration} na ${startHour}.`,
          answerType: 'hour'
        };
      }
    },
    {
      id: "1-3",
      template: (data) => `${data.name} ide u školu u ${data.startHour} sati, a završava u ${data.endHour} sati. Koliko sati provodi u školi?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 3) + 8; // 8-10
        const duration = Math.floor(Math.random() * 3) + 4; // 4-6 hours
        const endHour = startHour + duration;
        
        return {
          startHour,
          endHour,
          name: "{{CHARACTER_NAME}}",
          answer: duration,
          hint: `Oduzmi ${startHour} od ${endHour}.`,
          answerType: 'hour'
        };
      }
    }
  ],
  
  // Level 2: More complex scenarios with half hours
  2: [
    {
      id: "2-1",
      template: (data) => `Ako ${data.activity} počinje u ${data.startTimeStr} i završava u ${data.endTimeStr}, koliko sati traje?`,
      generateData: () => {
        const activities = ['škola', 'ručak', 'odmor', 'domaća zadaća', 'igranje'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const startHour = Math.floor(Math.random() * 12) + 1; // 1-12
        const startMinute = Math.random() > 0.5 ? 0 : 30;
        const hoursLater = Math.floor(Math.random() * 3) + 1; // 1-3 hours later
        const endHour = (startHour + hoursLater) % 12 || 12;
        const endMinute = startMinute;
        
        const startTimeStr = `${startHour}:${startMinute === 0 ? '00' : '30'}`;
        const endTimeStr = `${endHour}:${endMinute === 0 ? '00' : '30'}`;
        
        return {
          activity,
          startTimeStr,
          endTimeStr,
          startHour,
          startMinute,
          endHour,
          endMinute,
          answer: hoursLater,
          hint: `Izbroji sate od ${startTimeStr} do ${endTimeStr}.`,
          answerType: 'hour'
        };
      }
    },
    {
      id: "2-2",
      template: (data) => `${data.name} ima rođendansku proslavu koja počinje u ${data.startTimeStr} i traje ${data.durationHours} sata i ${data.durationMinutes} minuta. U koliko sati završava?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 6) + 1; // 1-6
        const startMinute = Math.random() > 0.5 ? 0 : 30;
        const durationHours = Math.floor(Math.random() * 2) + 1; // 1-2 hours
        const durationMinutes = Math.random() > 0.5 ? 0 : 30;
        
        let endHour = startHour + durationHours;
        let endMinute = startMinute + durationMinutes;
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        if (endHour > 12) {
          endHour = endHour % 12;
          if (endHour === 0) endHour = 12;
        }
        
        const startTimeStr = `${startHour}:${startMinute === 0 ? '00' : '30'}`;
        const answer = `${endHour}:${endMinute === 0 ? '00' : endMinute.toString().padStart(2, '0')}`;
        
        return {
          name: "{{CHARACTER_NAME}}",
          startTimeStr,
          durationHours,
          durationMinutes,
          startHour,
          startMinute,
          endHour,
          endMinute,
          answer,
          hint: `Dodaj ${durationHours} sata i ${durationMinutes} minuta na ${startTimeStr}.`,
          answerType: 'time'
        };
      }
    },
    {
      id: "2-3",
      template: (data) => `${data.name} kreće od kuće u ${data.startTimeStr} i dolazi u školu u ${data.endTimeStr}. Koliko traje put do škole?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 3) + 7; // 7-9
        const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        const durationMinutes = Math.floor(Math.random() * 3) * 15 + 15; // 15, 30, 45 minutes
        
        let endHour = startHour;
        let endMinute = startMinute + durationMinutes;
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        const startTimeStr = `${startHour}:${startMinute === 0 ? '00' : startMinute.toString().padStart(2, '0')}`;
        const endTimeStr = `${endHour}:${endMinute === 0 ? '00' : endMinute.toString().padStart(2, '0')}`;
        
        return {
          name: "{{CHARACTER_NAME}}",
          startTimeStr,
          endTimeStr,
          answer: `${Math.floor(durationMinutes / 60)} sat i ${durationMinutes % 60} minuta`,
          hint: `Izračunaj razliku između ${startTimeStr} i ${endTimeStr}.`,
          answerType: 'custom',
          customAnswer: [{
            type: 'minutes',
            value: durationMinutes
          }]
        };
      }
    }
  ],
  
  // Level 3: More complex scenarios with minutes
  3: [
    {
      id: "3-1",
      template: (data) => `Ako je večera u ${data.startHour} sati i vrijeme za spavanje je ${data.timeText} kasnije, u koliko sati je vrijeme za spavanje?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 4) + 6; // 6-9
        
        // Times in minutes
        const durations = [45, 60, 75, 90, 120];
        const durationMinutes = durations[Math.floor(Math.random() * durations.length)];
        const durationHours = Math.floor(durationMinutes / 60);
        const remainingMinutes = durationMinutes % 60;
        
        // Format the time text in Croatian
        const timeText = durationHours > 0 
          ? (remainingMinutes > 0 
              ? `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'} i ${remainingMinutes} minut${remainingMinutes === 1 ? 'a' : remainingMinutes < 5 ? 'e' : 'a'}` 
              : `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'}`)
          : `${durationMinutes} minut${durationMinutes === 1 ? 'a' : durationMinutes < 5 ? 'e' : 'a'}`;
        
        // Calculate end time correctly
        let endHour = startHour;
        let endMinute = 0;
        
        // Add duration to the start time
        endHour += Math.floor(durationMinutes / 60); // Add full hours
        endMinute += durationMinutes % 60;          // Add remaining minutes
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        // Convert to 12-hour format if needed
        if (endHour > 12) {
          endHour = endHour % 12;
          if (endHour === 0) endHour = 12;
        }
        
        // Format the answer
        let answer;
        let answerType = 'time';
        
        if (endMinute === 0) {
          answer = endHour;
          answerType = 'hour';
        } else {
          answer = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
        }
        
        return {
          startHour,
          timeText,
          durationMinutes,
          answer,
          hint: `Dodaj ${timeText} na ${startHour}:00.`,
          answerType,
          endHour,
          endMinute
        };
      }
    },
    {
      id: "3-2",
      template: (data) => `Ako počneš gledati film u ${data.startHour}:00 i traje ${data.timeText}, u koliko sati završava?`,
      generateData: () => {
        const startHour = Math.floor(Math.random() * 4) + 5; // 5-8
        
        // Film duration in minutes
        const durations = [90, 105, 120, 135, 150];
        const durationMinutes = durations[Math.floor(Math.random() * durations.length)];
        const durationHours = Math.floor(durationMinutes / 60);
        const remainingMinutes = durationMinutes % 60;
        
        // Format the time text in Croatian
        const timeText = durationHours > 0 
          ? (remainingMinutes > 0 
              ? `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'} i ${remainingMinutes} minut${remainingMinutes === 1 ? 'a' : remainingMinutes < 5 ? 'e' : 'a'}` 
              : `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'}`)
          : `${durationMinutes} minut${durationMinutes === 1 ? 'a' : durationMinutes < 5 ? 'e' : 'a'}`;
        
        // Calculate end time correctly
        let endHour = startHour;
        let endMinute = 0;
        
        // Add duration to the start time
        endHour += Math.floor(durationMinutes / 60); // Add full hours
        endMinute += durationMinutes % 60;          // Add remaining minutes
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        // Convert to 12-hour format if needed
        if (endHour > 12) {
          endHour = endHour % 12;
          if (endHour === 0) endHour = 12;
        }
        
        const answer = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
        
        return {
          startHour,
          timeText,
          durationMinutes,
          answer,
          hint: `Dodaj ${timeText} na ${startHour}:00.`,
          answerType: 'time',
          endHour,
          endMinute
        };
      }
    },
    {
      id: "3-3",
      template: (data) => `Ako ${data.activity} počinje u ${data.startHour}:${data.startMinute === 0 ? '00' : data.startMinute} i traje ${data.timeText}, u koliko sati završava?`,
      generateData: (characterChoice) => {
        const startHour = Math.floor(Math.random() * 6) + 3; // 3-8
        const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        const activity = characterChoice === 'boy' ? 'nogometni trening' : 'ples';
        
        // Activity duration in minutes
        const durations = [45, 60, 75, 90];
        const durationMinutes = durations[Math.floor(Math.random() * durations.length)];
        const durationHours = Math.floor(durationMinutes / 60);
        const remainingMinutes = durationMinutes % 60;
        
        // Format the time text in Croatian
        const timeText = durationHours > 0 
          ? (remainingMinutes > 0 
              ? `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'} i ${remainingMinutes} minut${remainingMinutes === 1 ? 'a' : remainingMinutes < 5 ? 'e' : 'a'}` 
              : `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'}`)
          : `${durationMinutes} minut${durationMinutes === 1 ? 'a' : durationMinutes < 5 ? 'e' : 'a'}`;
        
        // Calculate end time correctly
        let endHour = startHour;
        let endMinute = startMinute;
        
        // Add duration to the start time
        endHour += Math.floor(durationMinutes / 60); // Add full hours
        endMinute += durationMinutes % 60;          // Add remaining minutes
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        // Convert to 12-hour format if needed
        if (endHour > 12) {
          endHour = endHour % 12;
          if (endHour === 0) endHour = 12;
        }
        
        const answer = `${endHour}:${endMinute === 0 ? '00' : endMinute.toString().padStart(2, '0')}`;
        
        return {
          activity,
          startHour,
          startMinute,
          timeText,
          durationMinutes,
          answer,
          hint: `Dodaj ${timeText} na ${startHour}:${startMinute === 0 ? '00' : startMinute}.`,
          answerType: 'time',
          endHour,
          endMinute
        };
      }
    }
  ]
};

export default questions; 