# 插槽 Slots {#slots}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

## 插槽內容與出口 {#slot-content-and-outlet}

在之前的章節中，我們已經了解到組件能夠接收任意類型的 JavaScript 值作為 props，但組件要如何接收模板內容呢？在某些場景中，我們可能想要為子組件傳遞一些模板片段，讓子組件在它們的組件中渲染這些片段。

舉例來說，這裡有一個 `<FancyButton>` 組件，可以像這樣使用：

```vue-html{2}
<FancyButton>
  Click me! <!-- 插槽內容 -->
</FancyButton>
```

而 `<FancyButton>` 的模板是這樣的：

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- 插槽出口 -->
</button>
```

`<slot>` 元素是一個**插槽出口** (slot outlet)，標示了父元素提供的**插槽內容** (slot content) 將在哪裡被渲染。

![插槽圖示](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

最終渲染出的 DOM 是這樣：

```html
<button class="fancy-btn">Click me!</button>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

通過使用插槽，`<FancyButton>` 僅負責渲染外層的 `<button>` (以及相應的樣式)，而其內部的內容由父組件提供。

理解插槽的另一種方式是和下面的 JavaScript 函數作類比，其概念是類似的：

```js
// 父元素傳入插槽內容
FancyButton('Click me!')

// FancyButton 在自己的模板中渲染插槽內容
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

插槽內容可以是任意合法的模板內容，不局限於文本。例如我們可以傳入多個元素，甚至是組件：

```vue-html
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

通過使用插槽，`<FancyButton>` 組件更加靈活和具有可複用性。現在組件可以用在不同的地方渲染各異的內容，但同時還保證都具有相同的樣式。

Vue 組件的插槽機制是受[原生 Web Component `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)的啟發而誕生，同時還做了一些功能拓展，這些拓展的功能我們後面會學習到。

## 渲染作用域 {#render-scope}

插槽內容可以訪問到父組件的數據作用域，因為插槽內容本身是在父組件模板中定義的。舉例來說：

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

這裡的兩個 <span v-pre>`{{ message }}`</span> 插值表達式渲染的內容都是一樣的。

插槽內容**無法訪問**子組件的數據。Vue 模板中的表達式只能訪問其定義時所處的作用域，這和 JavaScript 的詞法作用域規則是一致的。換言之：

> 父組件模板中的表達式只能訪問父組件的作用域；子組件模板中的表達式只能訪問子組件的作用域。

## 默認內容 {#fallback-content}

在外部沒有提供任何內容的情況下，可以為插槽指定默認內容。比如有這樣一個 `<SubmitButton>` 組件：

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

如果我們想在父組件沒有提供任何插槽內容時在 `<button>` 內渲染“Submit”，只需要將“Submit”寫在 `<slot>` 標籤之間來作為默認內容：

```vue-html{3}
<button type="submit">
  <slot>
    Submit <!-- 默認內容 -->
  </slot>
</button>
```

現在，當我們在父組件中使用 `<SubmitButton>` 且沒有提供任何插槽內容時：

```vue-html
<SubmitButton />
```

“Submit”將會被作為默認內容渲染：

```html
<button type="submit">Submit</button>
```

但如果我們提供了插槽內容：

```vue-html
<SubmitButton>Save</SubmitButton>
```

那麼被顯式提供的內容會取代默認內容：

```html
<button type="submit">Save</button>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## 具名插槽 {#named-slots}

有時在一個組件中包含多個插槽出口是很有用的。舉例來說，在一個 `<BaseLayout>` 組件中，有如下模板：

```vue-html
<div class="container">
  <header>
    <!-- 標題內容放這裡 -->
  </header>
  <main>
    <!-- 主要內容放這裡 -->
  </main>
  <footer>
    <!-- 底部內容放這裡 -->
  </footer>
</div>
```

對於這種場景，`<slot>` 元素可以有一個特殊的 attribute `name`，用來給各個插槽分配唯一的 ID，以確定每一處要渲染的內容：

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

這類帶 `name` 的插槽被稱為具名插槽 (named slots)。沒有提供 `name` 的 `<slot>` 出口會隱式地命名為“default”。

在父組件中使用 `<BaseLayout>` 時，我們需要一種方式將多個插槽內容傳入到各自目標插槽的出口。此時就需要用到**具名插槽**了：

要為具名插槽傳入內容，我們需要使用一個含 `v-slot` 指令的 `<template>` 元素，並將目標插槽的名字傳給該指令：

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的內容放這裡 -->
  </template>
</BaseLayout>
```

`v-slot` 有對應的簡寫 `#`，因此 `<template v-slot:header>` 可以簡寫為 `<template #header>`。其意思就是“將這部分模板片段傳入子組件的 header 插槽中”。

![具名插槽圖示](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

下面我們給出完整的、向 `<BaseLayout>` 傳遞插槽內容的代碼，指令均使用的是縮寫形式：

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

當一個組件同時接收默認插槽和具名插槽時，所有位於頂級的非 `<template>` 節點都被隱式地視為默認插槽的內容。所以上面也可以寫成：

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隱式的默認插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

現在 `<template>` 元素中的所有內容都將被傳遞到相應的插槽。最終渲染出的 HTML 如下：

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

使用 JavaScript 函數來類比可能更有助於你來理解具名插槽：

```js
// 傳入不同的內容給不同名字的插槽
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> 渲染插槽內容到對應位置
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Conditional Slots {#conditional-slots}

Sometimes you want to render something based on whether or not a slot is present. 

You can use the [$slots](/api/component-instance.html#slots) property in combination with a [v-if](/guide/essentials/conditional.html#v-if) to achieve this.

In the example below we define a Card component with three conditional slots: `header`, `footer` and the `default` one.
When the header / footer / default is present we want to wrap them to provide additional styling:

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## 動態插槽名 {#dynamic-slot-names}

[動態指令參數](/guide/essentials/template-syntax.md#dynamic-arguments)在 `v-slot` 上也是有效的，即可以定義下面這樣的動態插槽名：

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 縮寫為 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

注意這裡的表達式和動態指令參數受相同的[語法限制](/guide/essentials/template-syntax.md#dynamic-argument-syntax-constraints)。

## 作用域插槽 {#scoped-slots}

在上面的[渲染作用域](#render-scope)中我們討論到，插槽的內容無法訪問到子組件的狀態。

然而在某些場景下插槽的內容可能想要同時使用父組件域內和子組件域內的數據。要做到這一點，我們需要一種方法來讓子組件在渲染時將一部分數據提供給插槽。

我們也確實有辦法這麼做！可以像對組件傳遞 props 那樣，向一個插槽的出口上傳遞屬性：

```vue-html
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

當需要接收插槽 props 時，默認插槽和具名插槽的使用方式有一些小區別。下面我們將先展示默認插槽如何接受 props，通過子組件標籤上的 `v-slot` 指令，直接接收到了一個插槽 props 對象：

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![scoped slots diagram](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

子組件傳入插槽的 props 作為了 `v-slot` 指令的值，可以在插槽內的表達式中訪問。

你可以將作用域插槽類比為一個傳入子組件的函數。子組件會將相應的 props 作為參數傳給它：

```js
MyComponent({
  // 類比默認插槽，將其想成一個函數
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // 在插槽函數調用時傳入 props
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

實際上，這已經和作用域插槽的最終代碼編譯結果、以及手動編寫[渲染函數](/guide/extras/render-function)時使用作用域插槽的方式非常類似了。

`v-slot="slotProps"` 可以類比這裡的函數簽名，和函數的參數類似，我們也可以在 `v-slot` 中使用解構：

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 具名作用域插槽 {#named-scoped-slots}

具名作用域插槽的工作方式也是類似的，插槽 props 可以作為 `v-slot` 指令的值被訪問到：`v-slot:name="slotProps"`。當使用縮寫時是這樣：

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

向具名插槽中傳入 props：

```vue-html
<slot name="header" message="hello"></slot>
```

注意插槽上的 `name` 是一個 Vue 特別保留的屬性，不會作為 props 傳遞給插槽。因此最終 `headerProps` 的結果是 `{ message: 'hello' }`。

如果你同時使用了具名插槽與默認插槽，則需要為默認插槽使用顯式的 `<template>` 標籤。嘗試直接為組件添加 `v-slot` 指令將導致編譯錯誤。這是為了避免因默認插槽的 props 的作用域而困惑。舉例：

```vue-html
<!-- 該模板無法編譯 -->
<template>
  <MyComponent v-slot="{ message }">
    <p>{{ message }}</p>
    <template #footer>
      <!-- message 屬於默認插槽，此處不可用 -->
      <p>{{ message }}</p>
    </template>
  </MyComponent>
</template>
```

為默認插槽使用顯式的 `<template>` 標籤有助於更清晰地指出 `message` 屬性在其他插槽中不可用：

```vue-html
<template>
  <MyComponent>
    <!-- 使用顯式的默認插槽 -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

### 高級列表組件示例 {#fancy-list-example}

你可能想問什麼樣的場景才適合用到作用域插槽，這裡我們來看一個 `<FancyList>` 組件的例子。它會渲染一個列表，並同時會封裝一些加載遠端數據的邏輯、使用數據進行列表渲染、或者是像分頁或無限滾動這樣更進階的功能。然而我們希望它能夠保留足夠的靈活性，將對單個列表元素內容和樣式的控制權留給使用它的父組件。我們期望的用法可能是這樣的：

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

在 `<FancyList>` 之中，我們可以多次渲染 `<slot>` 並每次都提供不同的數據 (注意我們這裡使用了 `v-bind` 來傳遞插槽的 props)：

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### 無渲染組件 {#renderless-components}

上面的 `<FancyList>` 案例同時封裝了可重用的邏輯 (數據獲取、分頁等) 和視圖輸出，但也將部分視圖輸出通過作用域插槽交給了消費者組件來管理。

如果我們將這個概念拓展一下，可以想象的是，一些組件可能只包括了邏輯而不需要自己渲染內容，視圖輸出通過作用域插槽全權交給了消費者組件。我們將這種類型的組件稱為**無渲染組件**。

這裡有一個無渲染組件的例子，一個封裝了追蹤當前鼠標位置邏輯的組件：

```vue-html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

雖然這個模式很有趣，但大部分可以透過無渲染組件實現的功能都可以通過組合式 API 以另一種更高效的方式實現，並且還不會帶來額外組件嵌套的開銷。之後我們會在[組合式函數](/guide/reusability/composables)一章中介紹如何更高效地實現追蹤鼠標位置的功能。

儘管如此，作用域插槽在需要**同時**封裝邏輯、組合視圖界面時還是很有用，就像上面的 `<FancyList>` 組件那樣。
