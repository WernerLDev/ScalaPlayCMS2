export function resizingPanel() {
  [].forEach.call(document.getElementsByClassName("iframe-wrapper"), function (iframewrapper: HTMLElement) {
    var div = document.createElement("div");
    div.id = "iframeblocker";
    div.className = "blockiframe";
    iframewrapper.appendChild(div);
  });
}

export function resizingPanelFinished() {
  [].forEach.call(document.getElementsByClassName("iframe-wrapper"), function (iframewrapper: HTMLElement) {
    [].forEach.call(iframewrapper.childNodes, function (node: HTMLElement) {
      if (node.id == "iframeblocker") {
        iframewrapper.removeChild(node);
      }
    })
  });
}

export function hideLeftPanel(leftpane: HTMLElement) {
  (leftpane.parentNode as HTMLElement).style.display = "none";
}

export function showLeftPanel(leftpane: HTMLElement) {
  (leftpane.parentNode as HTMLElement).style.display = "block";
}