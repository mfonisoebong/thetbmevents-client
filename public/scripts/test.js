const printBtn = document.getElementById("print");

printBtn?.addEventListener("click", () => {
  const elem = document.getElementById("ticket_information");
  const ticketId = elem.getAttribute("data-ticketId");
  const event = elem.getAttribute("data-event");
  const ticket = elem.getAttribute("data-ticket");
  const filename = `${event}_${ticket}_${ticketId}.pdf`;
  html2pdf().from(elem).save(filename);
});
