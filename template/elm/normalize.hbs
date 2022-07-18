echo "Normalizing using baldrick-whisker"
mkdir -p .vscode
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p src
mkdir -p tests
mkdir -p script
mkdir -p script/data
mkdir -p script/schema
mkdir -p script/template
test -f ".vscode/settings.json" || npx baldrick-whisker@latest object .vscode/settings.json github:flarebyte:baldrick-reserve:data/elm/vscode-settings.json
test -f "script/data/project.yaml" || npx baldrick-whisker@latest object script/data/project.yaml github:flarebyte:baldrick-reserve:data/elm/project.yaml
npx baldrick-whisker@latest object --no-ext .vscode/baldrick.code-snippets.json github:flarebyte:baldrick-reserve:data/elm/snippet.yaml
npx baldrick-whisker@latest object .github/ISSUE_TEMPLATE/bug_report.yaml github:flarebyte:baldrick-reserve:data/elm/bug-report.yaml
npx baldrick-whisker@latest object .github/ISSUE_TEMPLATE/feature_request.yaml github:flarebyte:baldrick-reserve:data/elm/feature-request.yaml
npx baldrick-whisker@latest object .github/workflows/main.yml github:flarebyte:baldrick-reserve:data/elm/workflow-main.yml
npx baldrick-whisker@latest object script/schema/project.schema.json github:flarebyte:baldrick-reserve:data/elm/project.schema.json
npx baldrick-whisker@latest render --no-ext elm.json github:flarebyte:baldrick-reserve:template/elm/gitignore.hbs .gitignore.sh
npx baldrick-whisker@latest render --no-ext elm.json github:flarebyte:baldrick-reserve:template/editorconfig.hbs .editorconfig.sh
npx baldrick-whisker@latest render elm.json github:flarebyte:baldrick-reserve:template/elm/contributing.hbs CONTRIBUTING.md
npx baldrick-whisker@latest render elm.json github:flarebyte:baldrick-reserve:template/elm/pull-request-template.hbs .github/pull_request_template.md
npx baldrick-whisker@latest render github:flarebyte:baldrick-reserve:data/glossary.yaml github:flarebyte:baldrick-reserve:template/glossary.hbs GLOSSARY.md
npx baldrick-whisker@latest render elm.json github:flarebyte:baldrick-reserve:template/elm/internationalization.hbs INTERNATIONALIZATION.md
npx baldrick-whisker@latest render elm.json github:flarebyte:baldrick-reserve:template/elm/accessibility.hbs ACCESSIBILITY.md
npx baldrick-whisker@latest render github:flarebyte:baldrick-reserve:data/elm/generated.yaml github:flarebyte:baldrick-reserve:template/elm/code-generation.hbs CODE_GENERATION.md
test -f "DECISIONS.md" || npx baldrick-whisker@latest render elm.json github:flarebyte:baldrick-reserve:template/decisions.hbs DECISIONS.md