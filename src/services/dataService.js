import { format, subDays, eachDayOfInterval } from 'date-fns';

// Utilities
const formatDate = (date) => format(date, 'yyyy-MM-dd');

const getPast30Days = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, 29); // 30 days total including today
    return eachDayOfInterval({ start: startDate, end: endDate });
}

// --- Mock Data Generators ---

const generateMockGitHubData = (dates) => {
    return dates.map(date => {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        let commitCount = 0;

        // "Passionate Dev" Persona
        const baseChance = isWeekend ? 0.3 : 0.8;

        if (Math.random() < baseChance) {
            commitCount = Math.floor(Math.random() * 15) + 1;
            if (Math.random() < 0.05) commitCount += 20;
        }

        return {
            date: formatDate(date),
            commits: commitCount,
        };
    });
};

const generateMockWeatherData = (commitData) => {
    return commitData.map(dayData => {
        let isRainy = Math.random() > 0.7;
        if (dayData.commits > 8) {
            isRainy = Math.random() > 0.4;
        }

        const tempBase = 20;
        const tempNoise = (Math.random() * 10) - 5;

        return {
            date: dayData.date,
            temperature: parseFloat((tempBase + tempNoise).toFixed(1)),
            rain: isRainy ? parseFloat((Math.random() * 20 + 2).toFixed(1)) : 0,
            weatherCode: isRainy ? 63 : 0,
        };
    });
};

// --- Real API Data Fetchers ---

const fetchGitHubEvents = async (username) => {
    if (!username) throw new Error("Username required");

    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
    if (!response.ok) {
        if (response.status === 404) throw new Error('User not found');
        throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const events = await response.json();
    const dailyCommits = {};

    // Parse PushEvents
    events
        .filter(e => e.type === 'PushEvent')
        .forEach(e => {
            const date = format(new Date(e.created_at), 'yyyy-MM-dd');
            const count = e.payload.size || 1;
            dailyCommits[date] = (dailyCommits[date] || 0) + count;
        });

    return dailyCommits;
};

const fetchRealWeather = async (lat, lon, startDate, endDate) => {
    try {
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,rain_sum,weather_code&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API error');
        const data = await response.json();

        return data.daily.time.map((time, index) => ({
            date: time,
            temperature: data.daily.temperature_2m_max[index],
            rain: data.daily.rain_sum[index],
            weatherCode: data.daily.weather_code[index],
        }));
    } catch (err) {
        console.error("Failed to fetch real weather", err);
        return null;
    }
};

/**
 * Main Service Function
 */
export const getMashupData = async (useRealData = false, location = { lat: 12.97, lon: 77.59 }, username = '') => {
    const dates = getPast30Days();
    const fmtDates = dates.map(d => formatDate(d));
    const startDateStr = fmtDates[0];
    const endDateStr = fmtDates[fmtDates.length - 1];

    // 1. Get Base Timeline (GitHub)
    let commitData = [];

    if (useRealData && username) {
        try {
            const realCommitsMap = await fetchGitHubEvents(username);
            // Map to the 30-day window
            commitData = fmtDates.map(d => ({
                date: d,
                commits: realCommitsMap[d] || 0
            }));
        } catch (error) {
            console.error("Error fetching real GitHub data:", error);
            throw error; // Re-throw to be handled by UI
        }
    } else {
        // Mock data source
        commitData = generateMockGitHubData(dates);
    }

    // 2. Get Weather Data (Real or Mock)
    let weatherData = null;
    if (useRealData) {
        weatherData = await fetchRealWeather(location.lat, location.lon, startDateStr, endDateStr);
    }

    // Fallback if real weather fails or is not requested
    if (!weatherData) {
        weatherData = generateMockWeatherData(commitData);
    }

    // 3. Merge
    // Create a map for fast lookup
    const weatherMap = new Map(weatherData.map(w => [w.date, w]));

    const merged = commitData.map(c => {
        const w = weatherMap.get(c.date) || { temperature: 20, rain: 0, weatherCode: 0 };
        return {
            date: c.date,
            commits: c.commits,
            temperature: w.temperature,
            rain: w.rain,
            weatherCode: w.weatherCode,
            // Derived metrics
            productivityScore: c.commits * 10,
            comfortIndex: 100 - Math.abs(w.temperature - 22) * 5,
        };
    });

    return merged;
};
