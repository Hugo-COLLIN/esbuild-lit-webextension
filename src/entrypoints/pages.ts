const loadComponents = async () => {
  const { ExportOptions } = await import('../interfaces/ExportOptions');
}

loadComponents();






// /**
//  * Router to load the correct component based on the current page.
//  */
// const loadComponent = async () => {
//   const currentPageUrl = window.location.pathname;
//
//   let pageContent;
//
//   switch (currentPageUrl) {
//     case '/options.html':
//       pageContent = await import('../interfaces/ExportOptions');
//       customElements.define('smc-component', pageContent.ExportOptions);
//       break;
//     default:
//       console.error('Page not found:', currentPageUrl);
//       pageContent = await import('../interfaces/ExportOptions');
//       break;
//
//   }
//
// };
//
// loadComponent();
