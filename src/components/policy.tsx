import { useEffect } from 'react';

const Policy: React.FC = () => {


  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: `
        <a href="https://www.iubenda.com/privacy-policy/18626314" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Privacy Policy ">Privacy Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
        <a href="https://www.iubenda.com/privacy-policy/18626314/cookie-policy" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Cookie Policy ">Cookie Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
        <script type="text/javascript">
        var _iub = _iub || [];
        _iub.csConfiguration = {"askConsentAtCookiePolicyUpdate":true,"enableFadp":true,"enableLgpd":true,"enableUspr":true,"fadpApplies":true,"floatingPreferencesButtonDisplay":"bottom-right","lang":"en","perPurposeConsent":true,"siteId":3404542,"usprApplies":true,"whitelabel":false,"cookiePolicyId":18626314, "banner":{ "acceptButtonDisplay":true,"backgroundOverlay":true,"closeButtonDisplay":false,"customizeButtonDisplay":true,"explicitWithdrawal":true,"listPurposes":true,"position":"float-bottom-center","rejectButtonDisplay":true,"showTitle":false }};
        </script>
        <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3404542.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stable/stub.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/stable/iubenda_cs.js" charset="UTF-8" async></script>
        `
      }} >

      </div>
    </>
  );
};

export default Policy;
