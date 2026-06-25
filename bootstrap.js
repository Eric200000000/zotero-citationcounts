/* Zotero Citation Counts - bootstrap entry point
 *
 * Forked from zotero-open-citations by Jose Siqueira de Cerqueira.
 * Modern Zotero 7/8/9 bootstrapped plugin. No XUL overlay, no install.rdf.
 * All real logic lives in lib/open-citations.js, loaded into this same scope
 * via loadSubScript so the `ZCC` namespace it defines is visible here.
 */

var ZCC;

function log(msg) {
  Zotero.debug("[CitationCounts/bootstrap] " + msg);
}

async function startup({ id, version, rootURI }, reason) {
  await Zotero.initializationPromise;
  Services.scriptloader.loadSubScript(rootURI + "lib/open-citations.js");
  try {
    await ZCC.init({ id, version, rootURI });
    log("started v" + version);
  } catch (e) {
    log("startup error: " + e + "\n" + (e && e.stack));
  }
}

function onMainWindowLoad({ window }) {
  if (ZCC) ZCC.addToWindow(window);
}

function onMainWindowUnload({ window }) {
  if (ZCC) ZCC.removeFromWindow(window);
}

function shutdown(data, reason) {
  if (reason === APP_SHUTDOWN) return;
  if (ZCC) {
    try { ZCC.shutdown(); } catch (e) { log("shutdown error: " + e); }
  }
  ZCC = undefined;
}

function install() {}
function uninstall() {}
