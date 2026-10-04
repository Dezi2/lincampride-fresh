# Lincampride - Campus Logistics (React Native / Expo)

Campus service hub with five screens: home menu, Dashboard, Find a Ride, Weather and Profile. Styled in Lagos danfo yellow and ink blue.

## Run it

```bash
npm install
npx expo start -c
```

Scan the QR code with Expo Go (phone and laptop on the same Wi-Fi). If the phone cannot connect, use:

```bash
npx expo start --tunnel -c
```

## Features

- Splash screen, then a main menu
- Dashboard: wallet balance, active trip (with cancel and refund), stats, live Lagos weather
- Find a Ride: search shuttles, reserve a seat, seat count drops, button disables when full
- Nigeria Weather: 36 states + FCT, live data from Open-Meteo (no API key)
- User Profile: student details, account stats, ride history from your bookings

## Edit your details

Name (Marvellous Francis), department, student ID and starting balance are in `src/data/user.js`.
Shuttles are in `src/data/shuttles.js`.

## Project structure

```
App.js                    navigation stack + providers
src/context/AppContext.js shared state (balance, seats, bookings)
src/screens/              one file per screen
src/components/           Screen shell + Card/Button
src/data/                 user, shuttles, states
src/services/weather.js   Open-Meteo request
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Lincampride campus logistics app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
