if (typeof window !== "undefined" && typeof document !== "undefined") {
    function initPagefind() {
        const searchElement = document.querySelector("#search");
      
        // If Pagefind is already initialized, do nothing.
        if (!searchElement || searchElement.querySelector(".pagefind-ui__form")) {
          return;
        }
    
        const loadAndInit = () => {
            // @ts-ignore
            new PagefindUI({
                element: "#search",
                showSubResults: true,
                showImages: false,
            });
        }
      
        // @ts-ignore
        if (typeof PagefindUI !== "undefined") {
            loadAndInit();
        } else {
            const base = import.meta.env.BASE_URL.replace(/\/$/, "");
            const script = document.createElement("script");
            script.src = `${base}/pagefind/pagefind.js`;
            script.onload = () => {
                loadAndInit();
            };
            document.body.appendChild(script);
        }
      }
      
      // astro:page-load runs on initial page load and after view transitions
      document.addEventListener("astro:page-load", initPagefind);
      initPagefind();
}