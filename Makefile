BLACK ?= \033[0;30m
RED ?= \033[0;31m
GREEN ?= \033[0;32m
YELLOW ?= \033[0;33m
BLUE ?= \033[0;34m
PURPLE ?= \033[0;35m
CYAN ?= \033[0;36m
GRAY ?= \033[0;37m
COFF ?= \033[0m

branch_name := $(shell git rev-parse --abbrev-ref HEAD)
commit := $(shell git rev-parse HEAD)

all: help
help: ## Display help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(CYAN)%-30s$(COFF) %s\n", $$1, $$2}'

deps: ## Install dependencies
	@echo "$(YELLOW)Gathering Libraries...$(COFF)"
	cd client && npm install
	cd server && npm install

api: ## Run the dev server
	@echo "$(GREEN)Starting API Server... $(COFF)"
	cd server && npm run dev

app: ## Run the client server
	@echo "$(GREEN)Starting Client App... $(COFF)"
	cd client && npm run dev
