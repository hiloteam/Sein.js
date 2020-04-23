@cn

展示基础组件的事件的处理，主要包含onClick、onTouchStart、onTouchMove、onTouchEnd和onTouchCancel(支持冒泡禁用)。在这里，若在GUI层的交互事件被触发，即击中GUI层的UI，会截断到GUI层为止，不触发三维世界的交互事件。

@en

Illustrate how to handle basic event with base GUI, including onClick, onTouchStart, onTouchMove, onTouchEnd and onTouchCancel. (stop propagation supported).