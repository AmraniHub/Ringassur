/**
 * LXLeadora — landing page lead bridge
 *
 * Drop this in before your form script:
 *   <script src="/lxleadora-lead.js" data-crm="https://xlead24.com"></script>
 *
 * Then on submit:
 *   LXLeadora.submit({
 *     vertical: 'mutuelle_sante',
 *     phone: tel, first_name: nom,
 *     departement: '33',
 *     vertical_data: { situation: sit, age_band: age }
 *   })
 *
 * Posts to /api/public/lead, which forwards into the CRM so the lead is
 * scored, routed to a paying client and billed. Without this the form
 * only reaches a spreadsheet and no client ever sees the lead.
 *
 * Never throws and never blocks: if the CRM is unreachable the visitor
 * still sees the success screen. Losing the lead is bad; showing an
 * error to someone who did nothing wrong is worse.
 */
(function (window, document) {
  'use strict'

  var script = document.currentScript
  var CRM_BASE = (script && script.getAttribute('data-crm')) || ''
  var pageLoadedAt = Date.now()

  function cookie(name) {
    var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return m ? m[2] : ''
  }

  function params() {
    try {
      return new URLSearchParams(window.location.search)
    } catch (e) {
      return { get: function () { return null } }
    }
  }

  /** Département from a postal code, handling DOM-TOM (971xx…). */
  function departementFrom(value) {
    var d = String(value || '').replace(/\D/g, '')
    if (d.length >= 5) {
      return (d.indexOf('97') === 0 || d.indexOf('98') === 0) ? d.slice(0, 3) : d.slice(0, 2)
    }
    if (d.length === 2 || d.length === 3) return d
    return ''
  }

  /**
   * Send a lead to the CRM.
   * Returns a Promise that always resolves — inspect `.ok` if you care.
   */
  function submit(lead) {
    var p = params()

    var payload = {
      source: lead.source || (p.get('utm_source') === 'facebook' ? 'meta_lp' : 'organic'),
      vertical: lead.vertical || 'rc_decennale',
      vertical_data: lead.vertical_data || {},

      first_name: lead.first_name || undefined,
      last_name: lead.last_name || undefined,
      phone: lead.phone,
      email: lead.email || undefined,
      departement: lead.departement || departementFrom(lead.postal_code) || '00',

      metier: lead.metier || undefined,
      situation: lead.situation || undefined,
      siret: lead.siret || undefined,

      campaign_id: lead.campaign_id || p.get('utm_campaign') || undefined,
      ad_id: lead.ad_id || p.get('utm_content') || undefined,
      landing_page: window.location.href,

      consent_text: lead.consent_text ||
        'J’accepte d’être recontacté par un conseiller partenaire concernant ma demande.',

      fbp: cookie('_fbp'),
      fbc: cookie('_fbc'),

      // Anti-bot: hidden field value, and how long the form took
      _hp: lead.honeypot || '',
      _t: Date.now() - pageLoadedAt
    }

    if (!payload.phone) {
      return Promise.resolve({ ok: false, error: 'missing_phone' })
    }

    return fetch(CRM_BASE + '/api/public/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().catch(function () { return {} }) })
      .then(function (json) {
        if (!json.ok) {
          // Logged for debugging, never surfaced to the visitor
          console.warn('[LXLeadora] lead not accepted:', json.error)
        }
        return json
      })
      .catch(function (e) {
        console.warn('[LXLeadora] lead send failed:', e)
        return { ok: false, error: 'network' }
      })
  }

  var api = {
    submit: submit,
    departementFrom: departementFrom,
    loadedAt: pageLoadedAt
  }

  // XLead24 is the current brand; LXLeadora stays as an alias so pages
  // already deployed against the old name keep working untouched.
  window.XLead24 = api
  window.LXLeadora = api
})(window, document)
