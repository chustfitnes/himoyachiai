.PHONY: up down test train eval dev lint

up:
	docker-compose up --build -d

down:
	docker-compose down

test:
	pytest backend/tests/
	npm test

train:
	python ml/generate_dataset.py
	python ml/train.py

eval:
	python ml/evaluate.py

dev:
	npm run dev

lint:
	npm run build
