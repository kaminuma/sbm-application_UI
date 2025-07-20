          // Transform activities to vue-cal v5 event format
        const transformedEvents = activities.map(activity => {
          if (!activity || !activity.start || !activity.end) {
            console.warn('Invalid activity data:', activity);
            return null;
          }
          
          // Handle date conversion more robustly
          let startDate = activity.start;
          let endDate = activity.end;
          
          // 開始時刻と終了時刻の順序チェック
          if (new Date(endDate) < new Date(startDate)) {
            console.warn('Invalid date range detected - end time is before start time:', {
              activity_id: activity.activityId,
              title: activity.title,
              start: startDate.toISOString(),
              end: endDate.toISOString()
            });
            return null;
          }
          
          // 日付の文字列を整形
          // 日付形式が "YYYY-MM-DD HH:MM:SS" または "YYYY-MM-DD" のどちらかで扱う
          const convertToDate = (dateStr) => {
            if (!dateStr) return null;
            
            try {
              if (typeof dateStr === 'string') {
                if (dateStr.includes('T') || dateStr.includes(' ')) {
                  return new Date(dateStr);
                } else {
                  // 日付のみの場合
                  return new Date(`${dateStr}T00:00:00`);
                }
              } else if (dateStr instanceof Date) {
                return dateStr;
              }
              
              const date = new Date(dateStr);
              return isNaN(date.getTime()) ? null : date;
            } catch (error) {
              console.error('Date conversion error:', error);
              return null;
            }
          };

          // 日付の変換
          let startDate = convertToDate(activity.start);
          let endDate = convertToDate(activity.end);

          // 日付の妥当性チェック
          if (!startDate || !endDate) {
            console.error(`Invalid date for activity: ${activity.activityId}`);
            return null;
          }

          // 開始時刻と終了時刻の順序チェック
          if (endDate < startDate) {
            console.warn('Invalid date range detected - end time is before start time:', {
              activity_id: activity.activityId,
              title: activity.title,
              start: startDate.toISOString(),
              end: endDate.toISOString()
            });
            return null;
          }