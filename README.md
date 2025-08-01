# Projeto de Automação de Testes

Este repositório contém uma suíte de testes automatizados em JEST para validação da API https://points-app-backend.vercel.app.

---
<br>

## Estrutura do Projeto
O repositório está organizado em quatro projetos principais, cada um focado em um tipo específico de teste:

  ```
📦 rethinkBankAPI/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline de Integração Contínua com GitHub Actions
├── tests/                          # Diretório principal dos testes automatizados
│   ├── api/                        # Testes de API organizados por funcionalidades ou endpoints
│   ├── endpoints/                  # Arquivo de mapeamento dos endpoints da API
│   ├── pojos/                      # Objetos de payload (POJOs) utilizados para requisições
│   └── utils/                      # Funções utilitárias (ex: geração de dados, autenticação)
├── .env                            # Variáveis de ambiente (ex: baseURL, token)
├── .gitignore                      # Arquivos/pastas ignorados pelo controle de versão Git
├── jest.config.js                  # Arquivo de configuração do Jest
├── package-lock.json               # Arquivo de lock do npm para versionamento das dependências
├── package.json                    # Arquivo principal com metadados do projeto e dependências
```

---
<br>

## 🛠️ Ferramentas e Linguagens Utilizadas
| Categoria | Tecnologia | Propósito |
| :--- | :--- | :--- |
| *Linguagem* | JavaScript (ES6+) | Desenvolvimento dos testes. |
| | nodeJS (22+) | Instalação de pacotes JS. |
| *Testes de API* | JEST | Framework para testes de serviços REST. |

---
<br>

## 🧪 Técnicas de Testes Utilizadas

A estratégia de testes foi definida com base em uma combinação de técnicas para garantir a máxima cobertura e eficiência.

#### 🔍 Análise de Risco

Os cenários de teste são priorizados com base no risco de negócio e na complexidade técnica. Funcionalidades críticas como:

Fluxos da API:
* Autenticação
* Confirmar email
* Realizar login
* Enviar e receber pontos
* Guardar e resgatar pontos da caixinha
* Conferir o saldo
* Excluir sua conta

 #### 🔍 Heurísticas de Teste

Utilizei heurísticas para guiar os testes exploratórios e a criação de novos cenários:

- CRUD: Para a API, garanti que as operações de **Criar**, **Ler**, **Atualizar** e **Deletar** sejam testadas para as principais entidades do sistema.

#### 🧩 Partição de Equivalência
Dividi os dados de entrada em classes de equivalência válidas e inválidas para aumentar a cobertura dos testes sem redundância.

Exemplos aplicados:

**Autenticação:**

* E-mail no formato correto e senha com mínimo de caracteres exigidos.

* E-mail em branco, formato incorreto, ou senha abaixo do mínimo.

**Transferência de Pontos:**

Valores positivos dentro do limite permitido.

Valores negativos, zero ou acima do limite máximo configurado.

**Cadastro de Usuário:**

* Nome completo, CPF válido, data de nascimento válida.

* CPF com menos de 11 dígitos, data futura, campos vazios.

Essa técnica permite validar diferentes comportamentos esperados com poucos testes bem planejados, evitando a repetição desnecessária de casos com o mesmo propósito.

---
<br>

## 🚀 Passo a Passo para Execução Local

Siga as instruções abaixo para clonar, configurar o ambiente e executar os testes localmente.


### 1️⃣ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas e configuradas:

- ✅ Git  
- 🌐 Node.js e npm (para gerenciamento de dependências JavaScript e execução de scripts)
- 💻 IDE de sua preferência (VS Code)  


### 2️⃣ Clonando o Repositório

```bash
git clone https://github.com/menahemlima/rethinkBankAPI.git
```

### 3️⃣ Configuração e Execução Local

Navegue até a pasta do projeto desejado:

```bash
cd rethinkBankAPI
```
Instale as Dependências do POM:

  ```bash
  npm install -f
  ```
Execute os Testes:
 Executar todos os testes

  ```bash
npx jest
  ```

Executar testes por tag configurada no Package.json
  ```bash
npm jest
  ```

Relatório de testes é gerado e salvo na pasta:
C:\...\git\rethinkBankAPI\reporter

---
<br>

### Execução via CI github actions

![Image](https://github.com/user-attachments/assets/fcfe825e-ca4c-4c40-bde7-ea2b88d8fd4c)

Após execução da CI no github Actions, o relatório de testes podem ser acessados normalmente

1. Acessar o respositório: https://github.com/menahemlima/rethinkBankAPI
2. Clicar em Actions > workflow run
3. Clicar no workflow > Re-run all jobs.

---
<br>

## Cenários de Testes Mapeados

Cenário 01: Cadastrar novo usuário com dados válidos

Cenário 02: Cadastrar novo usuário com email inválido

Cenário 03: Cadastrar novo usuário com nome inválido

Cenário 04: Cadastrar novo usuário com cpf inválido

Cenário 05: Cadastrar novo usuário com senhas divergentes

Cenário 06: Cadastrar novo usuário com senha fraca

Cenário 07: Cadastrar novo usuário com email existente

Cenário 08: Cadastrar novo usuário com cpf existente

Cenário 09: Realizar login com sucesso

Cenário 10: Realizar login com email não cadastrado

Cenário 11: Confirmar o e-mail de um usuário novo cadastrado

Cenário 12: Confirmar email informando token inválido

Cenário 13: Excluir usuário informando senha válida

Cenário 14: Excluir usuário informando senha inválida

Cenário 15: Excluir usuário informando senha inválida

Cenário 16: Verificar saldo de um novo usuário cadastrado

Cenário 17: Enviar pontos para si mesmo

Cenário 18: Enviar pontos para outro usuário com valor inteiro

Cenário 19: Enviar pontos com valor negativo

Cenário 20: Enviar pontos com token inválido

Cenário 21: Enviar pontos para usuário não existente

Cenário 22: Verificar extrato

Cenário 23: Verificar extrato com token inválido

Cenário 24: Verificar saldo do usuário

Cenário 25: Verificar saldo com token inválido

Cenário 26: Verificar saldo após recebimento de pontos

Cenário 27: Depositar de valor na caixinha

Cenário 28: Depositar valor acima do disponível na conta

Cenário 29: Depositar valor com token inválido

Cenário 30: Resgatar valor da caixinha

Cenário 31: Resgatar valor da caixinha informando token inválido

Cenário 32: Resgatar valor da caixinha informando número negativo

Cenário 33: Verificar extrato da caixinha após depósito

![Image](https://github.com/user-attachments/assets/74da8292-0bb1-4539-b031-e57fe7f75bf7)

---
<br>

## Bugs encontrados
| **Bug**                                                                                                                                         | **Criticidade** |
|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| Não é possível resgatar valor da caixinha informando número inteiro. Deve ser possível resgatar valor inteiro positivo, respeitando a regra de negócio (maior que zero e menor ou igual ao saldo). | Alta            |
| Não deve ser possível resgatar valor da caixinha informando valor negativo. Regra de negócio: valor deve ser maior que zero.                     | Alta            |
| É possível enviar pontos para si mesmo, o que não deveria ser permitido.                                                                         | Alta            |
| Ao cadastrar novo usuário com CPF existente, a API retorna status 400 em vez de 409 (Conflict).                                                  | Média           |
| Ao cadastrar novo usuário com e-mail existente, a API retorna status 400 em vez de 409 (Conflict).                                               | Média           |
| Mensagens divergentes entre o Swagger e Aplicação: "Não autorizado"  x  "Token inválido ou expirado"                                    | Baixa           |

---
<br>

## Critérios para aprovação da release

**a- Há bugs? Se sim, quais são e quais são os cenários esperados?**

* Pode ser consultado no tópico acima na tabela sobre os bugs encontrados.

**b- Se houver bugs, classifique-os em nível de criticidade.**

* 3 bugs - Alta
* 2 bugs - Média
* 1 bug - Baixa

**c- Diante do cenário, o sistema está pronto para subir em produção?**

* Não. O sistema não está pronto para o lançamento em produção. A presença de bugs críticos compromete a usabilidade e a credibilidade do produto. Portanto, é imprescindível que todos os bugs críticos sejam corrigidos e validados por meio de novos testes antes de prosseguir com a implantação.

---
<br>

## Links úteis

- Jest: [https://jestjs.io/](https://jestjs.io/)
- NodeJS: [https://nodejs.org/pt](https://nodejs.org/pt) 
- Vscode: [https://code.visualstudio.com/](https://code.visualstudio.com/) 