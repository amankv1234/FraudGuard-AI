# FraudGuard AI v2.0: Azure Infrastructure (Terraform)
# Regional coverage: Central India, South India

resource "azurerm_resource_group" "fraudguard" {
  name     = "rg-fraudguard-prod"
  location = "Central India"
}

resource "azurerm_eventhub_namespace" "fraudguard" {
  name                = "fraudguard-eh-premium"
  resource_group_name = azurerm_resource_group.fraudguard.name
  location            = azurerm_resource_group.fraudguard.location
  sku                 = "Premium"
  capacity            = 20  # Optimized for 50M TPS
}

resource "azurerm_cosmosdb_account" "fraud_memory" {
  name                = "fraudguard-cosmos-triple-store"
  resource_group_name = azurerm_resource_group.fraudguard.name
  location            = azurerm_resource_group.fraudguard.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  geo_location {
    location          = "centralindia"
    failover_priority = 0
  }
  
  geo_location {
    location          = "southindia"
    failover_priority = 1
  }

  capabilities {
    name = "EnableVectorSearch"
  }
  
  capabilities {
    name = "EnableGremlin"
  }
}

resource "azurerm_service_plan" "logic_plan" {
  name                = "fraudguard-asp"
  resource_group_name = azurerm_resource_group.fraudguard.name
  location            = azurerm_resource_group.fraudguard.location
  os_type             = "Linux"
  sku_name            = "EP1" # Elastic Premium for high scale
}

resource "azurerm_linux_function_app" "decision_agent" {
  name                = "fraudguard-decision-agent"
  resource_group_name = azurerm_resource_group.fraudguard.name
  location            = azurerm_resource_group.fraudguard.location
  service_plan_id      = azurerm_service_plan.logic_plan.id
  storage_account_name = "fgstorageagent"
  storage_account_access_key = "MOCK_KEY"
}
