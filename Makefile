.PHONY: install dev-backend dev-frontend test docker-up docker-down

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev-backend:
	cd backend && python run.py

dev-frontend:
	cd frontend && npm run dev

test:
	cd backend && pytest

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down
