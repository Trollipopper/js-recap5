const table = document.querySelector('table');
const dialog = document.querySelector('dialog');

const sortedRestaurants = [...restaurants].sort((a, b) =>
  a.name.localeCompare(b.name)
);

sortedRestaurants.forEach((restaurant, index) => {
  const row = document.createElement('tr');
  row.className = 'restaurant-row';
  row.dataset.index = index;

  const nameTd = document.createElement('td');
  const addressTd = document.createElement('td');

  nameTd.textContent = restaurant.name;
  addressTd.textContent = restaurant.address;

  row.append(nameTd, addressTd);
  table.appendChild(row);
});

table.addEventListener('click', (event) => {
  const row = event.target.closest('.restaurant-row');
  if (!row) return;

  document.querySelectorAll('.restaurant-row').forEach((item) => {
    item.classList.remove('highlight');
  });
  row.classList.add('highlight');

  const restaurant = sortedRestaurants[Number(row.dataset.index)];

  dialog.innerHTML = `
    <h3>${restaurant.name}</h3>
    <p>${restaurant.address}</p>
    <p>${restaurant.postalCode}</p>
    <p>${restaurant.city}</p>
    <p>${restaurant.phone}</p>
    <p>${restaurant.company}</p>
    <form method="dialog">
      <button>Close</button>
    </form>
  `;

  dialog.showModal();
});
