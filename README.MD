# 🎹 Virtual Piano

Um piano que você toca com o **teclado do computador**, com o **mouse** ou com o **dedo** no celular. Feito com **HTML, CSS e JavaScript puro**, sem frameworks e sem nenhuma biblioteca de fora. Ele tem 17 teclas (de Dó a Mi), dá para **gravar o que você toca** e ainda tem **aulas** para aprender músicas.

> 🎉 **Parabéns aos criadores do projeto original** pela ideia e pela base tão bem pensada para quem está aprendendo JavaScript. Esta versão nasceu dela e mantém a mesma estrutura de arquivos e o mesmo visual. Veja os créditos no final.

---

## 🎮 Como usar

1. Abra o piano e aperte as teclas do teclado (`A S D F G H J K L ;` e as pretas `W E T Y U O P`), ou clique nelas.
2. Segure várias teclas ao mesmo tempo para tocar **acordes**.
3. Use o controle de **Volume** e os botões **Teclas** e **Notas** para mostrar ou esconder as letras e os nomes das notas.
4. Clique em **● Gravar**, toque, e clique em **■ Parar**. Depois use **▶ Tocar** para ouvir a sua gravação.
5. Escolha uma música na lista e clique em **Ouvir** para escutá-la, ou em **Aprender** para tocar junto: a tecla da vez fica piscando em verde.

### As teclas

| Teclado | Nota | Teclado | Nota |
|---|---|---|---|
| `A` | Dó | `K` | Dó (mais agudo) |
| `W` | Dó# | `O` | Dó# |
| `S` | Ré | `L` | Ré |
| `E` | Ré# | `P` | Ré# |
| `D` | Mi | `;` | Mi |
| `F` | Fá | | |
| `T` | Fá# | | |
| `G` | Sol | | |
| `Y` | Sol# | | |
| `H` | Lá | | |
| `U` | Lá# | | |
| `J` | Si | | |

---

## ✨ O que o piano tem

- **Teclado de piano de verdade**: as teclas brancas e pretas seguem o desenho certo (sem tecla preta entre Mi e Fá, nem entre Si e Dó).
- **Várias notas ao mesmo tempo**, com acordes.
- **Cada nota brilha com uma cor** e solta notinhas musicais ao ser tocada.
- **Nomes das notas** (Dó, Ré, Mi...) junto com as letras do teclado.
- **Gravação**: guarda o que você tocou, com o ritmo, e salva no navegador.
- **Aulas**: Ode à Alegria, Brilha, brilha, estrelinha e Parabéns pra Você. Você ouve a música e depois toca. No final, ganha de 1 a 3 estrelas.
- **Funciona no celular**: o piano se ajusta à tela e dá para deslizar o dedo sobre as teclas.
- Aceita letra maiúscula (Caps Lock ou Shift) e não repete o som quando você segura a tecla.

---

## 🔍 Como funciona (explicação simples)

### Como o som toca
Cada tecla tem um arquivo `.wav` na pasta `src/tunes`, com o mesmo nome da tecla (`a.wav`, `w.wav`...). Ao apertar, o `engine.js` carrega o áudio e toca uma **cópia dele** (`cloneNode`). Assim, cada nota é independente: uma não corta a outra, e dá para tocar acordes.

### Os arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Monta o piano, os controles de volume e os botões de gravação e aula. |
| `src/styles/reset.css` | Zera as margens e define a fonte da página. |
| `src/styles/main.css` | Todo o visual: teclado, brilho das teclas, animações e layout para celular. |
| `src/scripts/engine.js` | Toda a lógica: tocar, gravar, reproduzir e as aulas. |
| `src/tunes` | Os 17 áudios, um para cada nota. |

### Como a gravação funciona
Enquanto você grava, o código guarda uma lista com **qual tecla** foi tocada e **em que momento**, em milissegundos. Para reproduzir, ele percorre essa lista e aperta cada tecla na hora certa, com `setTimeout`.

### Como a aula funciona
Cada música é uma lista de teclas (`"a a g g h h g..."`). A tecla da vez ganha a classe `target` e pisca. Se você acerta, avança para a próxima. Se errar, a tecla balança e o erro é contado.

---

## 🧠 O que dá para aprender com este projeto

- Tratar eventos de **teclado** (`keydown` e `keyup`) e de **ponteiro** (mouse e toque) com `pointerdown`.
- Tocar sons com a classe `Audio` e `cloneNode`.
- Guardar dados com `localStorage`.
- Controlar o tempo com `setTimeout` e `performance.now()`.
- Trabalhar com listas e objetos (`Set`, `Map` de teclas, lista de músicas).
- Montar um visual caprichado só com CSS: `flexbox`, variáveis (`--hue`, `--kw`), animações e layout responsivo.

---

## 🛠️ Tecnologias usadas

| Tecnologia | Para que serve neste projeto |
|---|---|
| **HTML** | Estrutura do piano e dos controles. |
| **CSS** | Visual, brilho das teclas, animações e layout responsivo. |
| **JavaScript** | A lógica: tocar, gravar, reproduzir e as aulas. |
| **Google Fonts** | A fonte Poppins. |

---

## ▶️ Como rodar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador, com duplo clique.

Se você usa o **VS Code**, também pode clicar em **Go Live** (extensão *Live Server*).

> 💡 **Importante:** a fonte precisa de **internet**. Sem conexão, o piano continua funcionando, só com uma fonte padrão.

---

## 📁 Estrutura do projeto

```
├── index.html
├── README.MD
└── src
    ├── scripts
    │   └── engine.js
    ├── styles
    │   ├── reset.css
    │   └── main.css
    └── tunes
        ├── a.wav ... p.wav
        └── ;.wav
```

---

## 🚀 O que foi melhorado em relação ao original

**Mantido do original:** a mesma estrutura de arquivos, o visual preto com a fonte Poppins, as 17 teclas e os mesmos áudios, o controle de volume e o botão de mostrar as teclas.

**Corrigido:**
- As teclas brancas e pretas de **Fá a Si** estavam com as cores trocadas em relação ao som. Agora o desenho segue um piano de verdade.
- A cor da tecla apertada não aparecia, por causa de um erro de sintaxe no CSS (faltava uma vírgula no `linear-gradient`).
- Só tocava **uma nota por vez**, e agora toca várias.
- O volume só funcionava depois de mexer no controle, e agora vale desde o início.
- Letras maiúsculas (Caps Lock ou Shift) não tocavam, e segurar a tecla repetia o som.
- O piano estourava a tela no celular.

**Novo:**
- Gravação e reprodução, salvas no navegador.
- Aulas com 3 músicas, tecla guia e estrelas.
- Nomes das notas, brilho colorido e notinhas que sobem.
- Toque e deslizar o dedo no celular.

---

## 🙌 Créditos

Este projeto é uma versão melhorada do **js-music-keyboard-virtual**, proposto pela **[DIO](https://www.dio.me/)**, com base no repositório original.

Muito obrigado pela ideia e pela base do projeto! 👏

As músicas das aulas (Ode à Alegria, Brilha, brilha, estrelinha e Parabéns pra Você) são tradicionais e de domínio público. Este é um projeto de estudo, sem fins comerciais.

---

## 👨‍💻 Autor desta versão

Feito por **Vinícius Cruz dos Santos**

[![GitHub](https://img.shields.io/badge/GitHub-Viniciuscruzdossantos-181717?logo=github)](https://github.com/Viniciuscruzdossantos)
