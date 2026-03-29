const table = document.querySelector('table');
const dialog = document.querySelector('dialog');

const RESTAURANTS_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const MENU_URL = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/fi`;

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function formatMenu(menuData) {
  if (!menuData) return '<p>No menu available.</p>';

  if (Array.isArray(menuData) && menuData.length > 0) {
    return `
      <ul>
        ${menuData.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }

  if (menuData.meals && Array.isArray(menuData.meals)) {
    return `
      <ul>
        ${menuData.meals.map((meal) => `<li>${meal.name || meal}</li>`).join('')}
      </ul>
    `;
  }

  return `<p>${JSON.stringify(menuData)}</p>`;
}

async function loadRestaurants() {
  try {
    const data = await fetchData(RESTAURANTS_URL);

    const restaurants = Array.isArray(data)
      ? data
      : data.restaurants || data.data || [];

    restaurants.sort((a, b) => a.name.localeCompare(b.name));

    restaurants.forEach((restaurant, index) => {
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

    table.addEventListener('click', async (event) => {
      const row = event.target.closest('.restaurant-row');
      if (!row) return;

      document.querySelectorAll('.restaurant-row').forEach((item) => {
        item.classList.remove('highlight');
      });
      row.classList.add('highlight');

      const restaurant = restaurants[Number(row.dataset.index)];

      try {
        const menuData = await fetchData(
          `${MENU_URL}?restaurant=${encodeURIComponent(restaurant._id || restaurant.name)}`
        );

        dialog.innerHTML = `
          <h3>${restaurant.name}</h3>
          <p>${restaurant.address}</p>
          <p>${restaurant.postalCode}</p>
          <p>${restaurant.city}</p>
          <p>${restaurant.phone}</p>
          <p>${restaurant.company}</p>
          <h3>Menu</h3>
          ${formatMenu(menuData)}
          <form method="dialog">
            <button>Close</button>
          </form>
        `;
      } catch (error) {
        dialog.innerHTML = `
          <h3>${restaurant.name}</h3>
          <p>${restaurant.address}</p>
          <p>${restaurant.postalCode}</p>
          <p>${restaurant.city}</p>
          <p>${restaurant.phone}</p>
          <p>${restaurant.company}</p>
          <p>Menu could not be loaded.</p>
          <form method="dialog">
            <button>Close</button>
          </form>
        `;
      }

      dialog.showModal();
    });
  } catch (error) {
    table.insertAdjacentHTML(
      'afterend',
      '<p>Restaurant data could not be loaded.</p>'
    );
    console.error(error);
  }
}

loadRestaurants();
