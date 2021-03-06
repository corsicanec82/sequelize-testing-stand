ID := $(shell basename $(CURDIR))
IMAGE_ID := $(addsuffix _image, $(ID))
USER_ID := $(shell id -u)
GROUP_ID := $(shell id -g)
USERNAME := current

setup: prepare compose-build compose-install compose-db-setup

prepare:
	touch .bash_history
	touch .env
	echo USER_ID=$(USER_ID) > .env
	echo GROUP_ID=$(GROUP_ID) >> .env
	echo USERNAME=$(USERNAME) >> .env
	echo IMAGE_ID=$(IMAGE_ID) >> .env

compose-build:
	docker-compose build \
		--build-arg USER_ID=$(USER_ID) \
		--build-arg GROUP_ID=$(GROUP_ID) \
		--build-arg USERNAME=$(USERNAME) \

compose-install:
	docker-compose run app make install

compose-db-setup:
	docker-compose run app make db-setup

compose-lint:
	docker-compose run app make lint

compose-test:
	docker-compose run app make test

compose:
	docker-compose up

compose-bash:
	docker-compose run app bash

compose-kill:
	docker-compose kill

install:
	npm install

lint:
	npx eslint .

test:
	npm test

db-setup:
	npx sequelize db:migrate
