const pako = require("pako");

function encodeDiagram(source) {
  const data = Buffer.from(source, "utf8");
  const compressed = pako.deflate(data, { level: 9 });
  return Buffer.from(compressed)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const supportedDiagramTypes = [
  "actdiag",
  "blockdiag",
  "bpmn",
  "bytefield",
  "c4plantuml",
  "diagramsnet",
  "ditaa",
  "erd",
  "excalidraw",
  "graphviz",
  "mermaid",
  "nomnoml",
  "nwdiag",
  "packetdiag",
  "pikchr",
  "plantuml",
  "rackdiag",
  "seqdiag",
  "structurizr",
  "svgbob",
  "umlet",
  "vega",
  "vegalite",
  "wavedrom",
];

function mermaidPlugin(md) {
  const origRule = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    if (supportedDiagramTypes.includes(token.info)) {
      const code = token.content.trim();
      const encodedDiagram = encodeDiagram(code);
      return `<img src="https://kroki.io/${token.info}/svg/${encodedDiagram}">`;
    }

    // Other languages
    return origRule(tokens, idx, options, env, slf);
  };
}

module.exports = mermaidPlugin;
