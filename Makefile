BIN := ./node_modules/.bin
TEST_FILES := test/support.js $(shell find test/specs -type f -name "*.js")

.PHONY: serve test bdd

test:
	@$(BIN)/mocha --colors $(TEST_FILES)

bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

migrate:
	@$(BIN)/sequelize --config ./config/db_config.js -m

migrate-rollback:
	@$(BIN)/sequelize --config ./config/db_config.js -m -u

migration:
	@$(BIN)/sequelize --config ./config/db_config.js -c $(NAME)

serve:
	./bin/www
