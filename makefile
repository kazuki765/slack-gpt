run:
	make clean
	docker compose build
	docker compose up

stop:
	docker compose down

clean:
	docker compose down --rmi all --volumes --remove-orphans