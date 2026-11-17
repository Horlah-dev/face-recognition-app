# Face Recognition App

A full-stack web app where users can register, sign in, submit an image URL, and detect faces in the image. The app draws boxes around detected faces and tracks each signed-in user's scan count.

## Built With

- React
- Express
- PostgreSQL
- Human (face detection)

## Features

- User registration and sign-in
- Password hashing
- Token-based authentication
- Face detection with bounding boxes
- Per-user scan count and rank display

## Project Structure

- `src/` — React frontend
- `backend/` — Express API and PostgreSQL connection

## Running Locally

The frontend and backend are run separately. Install dependencies in the project root and in `backend/`, configure the required environment variables, then start each app using its package scripts.

## Notes

This app detects faces in images. It does not identify who a person is.