/** Create a progress indicator
 *  at the top */
function createProgressBar() {
  // Create the main container div
  const progressContainer = document.createElement("div");
  progressContainer.className =
    "progress-container fixed top-0 z-10 h-1 w-full bg-background";

  // Create the progress bar div
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar h-1 w-0 bg-accent";
  progressBar.id = "myBar";

  // Append the progress bar to the progress container
  progressContainer.appendChild(progressBar);

  // Append the progress container to the document body or any other desired parent element
  if (document.body) {
    document.body.appendChild(progressContainer);
  }
}

/** Update the progress bar
 *  when user scrolls */
function updateScrollProgress() {
  document.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (document) {
      const myBar = document.getElementById("myBar");
      if (myBar) {
        myBar.style.width = scrolled + "%";
      }
    }
  });
}

/** Attaches links to headings in the document,
 *  allowing sharing of sections easily */
function addHeadingLinks() {
  const headings = Array.from(
    document.querySelectorAll("h2, h3, h4, h5, h6")
  );
  for (const heading of headings) {
    if (heading.id) {
      heading.classList.add("group");
      const link = document.createElement("a");
      link.className =
        "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
      link.href = "#" + heading.id;

      const span = document.createElement("span");
      span.ariaHidden = "true";
      span.innerText = "#";
      link.appendChild(span);
      heading.appendChild(link);
    }
  }
}

/** Attaches copy buttons to code blocks in the document,
 * allowing users to copy code easily. */
function attachCopyButtons() {
  const copyButtonLabel = "Copy";
  const codeBlocks = Array.from(document.querySelectorAll("pre"));

  for (const codeBlock of codeBlocks) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    // Check if --file-name-offset custom property exists
    const computedStyle = getComputedStyle(codeBlock);
    const hasFileNameOffset =
      computedStyle.getPropertyValue("--file-name-offset").trim() !== "";

    // Determine the top positioning class
    const topClass = hasFileNameOffset
      ? "top-[calc(var(--file-name-offset)_-_2rem)]"
      : "-top-3";

    const copyButton = document.createElement("button");
    copyButton.className = `copy-code absolute end-3 ${topClass} rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium`;
    copyButton.innerHTML = copyButtonLabel;
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    // wrap codebock with relative parent element
    if (codeBlock.parentNode) {
      codeBlock.parentNode.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
    }

    copyButton.addEventListener("click", async () => {
      await copyCode(codeBlock, copyButton);
    });
  }

  async function copyCode(block, button) {
    const code = block.querySelector("code");
    let text = code?.innerText;

    // The code block may contain a file name in a ::before pseudo-element.
    // This is a hacky way to remove it from the copied text.
    if (text && text.startsWith("v2")) {
        const lines = text.split('\n');
        text = lines.slice(1).join('\n');
    }

    if (text) {
      await navigator.clipboard.writeText(text);
    }


    // visual feedback that task is completed
    button.innerText = "Copied";

    setTimeout(() => {
      button.innerText = copyButtonLabel;
    }, 700);
  }
}

function runPostDetailsScripts() {
  // Don't run if we're not on a post page
  if (document.querySelector("#article") === null) return; 
  
  createProgressBar();
  updateScrollProgress();
  addHeadingLinks();
  attachCopyButtons();
}

runPostDetailsScripts();

/* Go to page start after page swap */
document.addEventListener("astro:after-swap", () => {
  runPostDetailsScripts();
  window.scrollTo({ left: 0, top: 0, behavior: "instant" });
});
