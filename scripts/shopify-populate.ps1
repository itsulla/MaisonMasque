$store = "0gk4tx-0x.myshopify.com"
$queryDir = "$PSScriptRoot\shopify-queries"

Write-Host "=== Maison Masque - Shopify Product Creator ===" -ForegroundColor Cyan
Write-Host "Store: $store"
Write-Host "Query dir: $queryDir"
Write-Host ""

Write-Host "--- Creating Collections ---" -ForegroundColor Yellow
npx shopify store execute --store $store --allow-mutations --query-file "$queryDir\collections.graphql"

Write-Host ""
Write-Host "--- Creating Products ---" -ForegroundColor Yellow

$products = @(
    @{file="p01-medicube-gel-mask.graphql";    name="Ritual I - Medicube Gel Mask"},
    @{file="p02-medicube-wrapping.graphql";    name="Ritual II - Medicube Wrapping"},
    @{file="p03-abib-heartleaf.graphql";       name="Ritual III - Abib Heartleaf"},
    @{file="p04-numbuzin.graphql";             name="Ritual IV - Numbuzin"},
    @{file="p05-skin1004.graphql";             name="Ritual V - SKIN1004"},
    @{file="p06-boj-sun.graphql";              name="Morning Veil - BoJ Sun"},
    @{file="p07-heimish.graphql";              name="Morning Veil - Heimish"},
    @{file="p08-medicube-serum.graphql";       name="Elixir I - Medicube Serum"},
    @{file="p09-celdyque.graphql";             name="Elixir II - CELDYQUE"},
    @{file="p10-medicube-toner.graphql";       name="Elixir III - Medicube Toner"}
)

foreach ($p in $products) {
    Write-Host "  Creating: $($p.name)..." -NoNewline
    npx shopify store execute --store $store --allow-mutations --query-file "$queryDir\$($p.file)"
    Write-Host ""
}

Write-Host ""
Write-Host "--- Getting Variant IDs for Pricing ---" -ForegroundColor Yellow
npx shopify store execute --store $store --query-file "$queryDir\get-variants.graphql"

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Check: https://admin.shopify.com/store/maison-masque-2/products"
