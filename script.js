/* =============================================
   FRESH CART — JAVASCRIPT
   What this file does:
   1. changeQty()   — handles the + and − buttons on item cards
   2. addToList()   — adds an item to the grocery list
   3. removeItem()  — removes one item from the grocery list
   4. toggleBought()— marks/unmarks an item as bought
   5. clearAll()    — removes every item from the list
   6. updateUI()    — keeps the item count and empty message in sync
============================================= */


/* ─────────────────────────────────────────────
   STEP 1: changeQty
   Called when the user clicks + or −
   - btn    : the button element that was clicked
   - delta  : +1 (increase) or -1 (decrease)
───────────────────────────────────────────── */
function changeQty(btn, delta) {
  /*
    btn.parentElement is the .qty-controls div
    Inside it we find the <input class="qty-input">
  */
  const input = btn.parentElement.querySelector('.qty-input');

  /* Convert the current text value to a number */
  let current = parseInt(input.value);

  /* Add delta (+1 or -1) */
  let newVal = current + delta;

  /* Don't go below 1 */
  if (newVal < 1) newVal = 1;

  /* Update the input box */
  input.value = newVal;
}


/* ─────────────────────────────────────────────
   STEP 2: addToList
   Called when the user clicks "Add to List"
   - btn   : the button element clicked
   - name  : the item name, e.g. "Apple"
   - emoji : a small emoji icon, e.g. "🍎"
───────────────────────────────────────────── */
function addToList(btn, name, emoji) {

  /* Get the quantity from the qty-input in the same card */
  const card  = btn.closest('.item-card');  // walk up to the parent card
  const input = card.querySelector('.qty-input');
  const qty   = parseInt(input.value);      // read the current qty value

  /* Get the grocery list <ul> and empty message <p> */
  const list     = document.getElementById('groceryList');
  const emptyMsg = document.getElementById('emptyMsg');

  /* ── Check: is this item already in the list? ──
     We look for a list item whose data-name matches */
  const existing = list.querySelector(`li[data-name="${name}"]`);

  if (existing) {
    /*
      Item is already in the list.
      Instead of adding a duplicate, we just increase its quantity.
    */
    const qtySpan = existing.querySelector('.list-item-qty');
    const currentQty = parseInt(existing.dataset.qty);
    const newQty = currentQty + qty;

    /* Update the stored quantity and the displayed text */
    existing.dataset.qty = newQty;
    qtySpan.textContent  = `×${newQty}`;

    /* Give a little visual "bump" to show it was updated */
    existing.style.background = '#fff9c4';   /* flash yellow */
    setTimeout(() => existing.style.background = '', 500);

  } else {
    /*
      Item is NOT in the list yet.
      Create a new <li> and add it.
    */

    /* Create the <li> element */
    const li = document.createElement('li');

    /*
      Store name and qty as data attributes so we can read them later.
      data-name="Apple"  data-qty="2"
    */
    li.dataset.name = name;
    li.dataset.qty  = qty;

    /* Build the HTML inside the <li> */
    li.innerHTML = `
      <!-- Checkbox to mark as "bought" -->
      <input
        type="checkbox"
        onchange="toggleBought(this)"
        aria-label="Mark ${name} as bought"
      />

      <!-- Emoji icon -->
      <span class="list-item-emoji">${emoji}</span>

      <!-- Item name + quantity text -->
      <span class="list-item-text">
        ${name}
        <span class="list-item-qty">×${qty}</span>
      </span>

      <!-- Remove button -->
      <button
        class="remove-btn"
        onclick="removeItem(this)"
        aria-label="Remove ${name}"
        title="Remove"
      >×</button>
    `;

    /* Add the new item to the top of the list */
    list.prepend(li);

    /* Hide the "nothing here yet" message */
    emptyMsg.style.display = 'none';
  }

  /* Reset the quantity input back to 1 for next use */
  input.value = 1;

  /* Update the item count badge */
  updateUI();
}


/* ─────────────────────────────────────────────
   STEP 3: removeItem
   Called when the user clicks the "×" remove button
   - btn : the × button that was clicked
───────────────────────────────────────────── */
function removeItem(btn) {
  /*
    btn.closest('li') finds the parent <li>
    We remove it from the list
  */
  const li = btn.closest('li');

  /* Fade-out animation before removing */
  li.style.transition = 'opacity 0.2s, transform 0.2s';
  li.style.opacity    = '0';
  li.style.transform  = 'translateX(20px)';

  /* Wait for animation to finish, then remove from DOM */
  setTimeout(() => {
    li.remove();
    updateUI();
  }, 200);
}


/* ─────────────────────────────────────────────
   STEP 4: toggleBought
   Called when the checkbox is checked/unchecked
   - checkbox : the checkbox input element
───────────────────────────────────────────── */
function toggleBought(checkbox) {
  /* The parent <li> of this checkbox */
  const li = checkbox.closest('li');

  if (checkbox.checked) {
    /* Add the "bought" class — CSS will apply line-through */
    li.classList.add('bought');
  } else {
    /* Remove the class — text goes back to normal */
    li.classList.remove('bought');
  }
}


/* ─────────────────────────────────────────────
   STEP 5: clearAll
   Called when the user clicks "Clear All"
   Removes every item from the grocery list
───────────────────────────────────────────── */
function clearAll() {
  const list = document.getElementById('groceryList');

  /* Confirm before deleting everything */
  const confirmed = confirm('Remove all items from your grocery list?');

  if (confirmed) {
    /* Remove all child <li> elements */
    list.innerHTML = '';
    updateUI();
  }
}


/* ─────────────────────────────────────────────
   STEP 6: updateUI
   Keeps the count badge and empty message in sync.
   Called after every add / remove / clear.
───────────────────────────────────────────── */
function updateUI() {
  const list      = document.getElementById('groceryList');
  const emptyMsg  = document.getElementById('emptyMsg');
  const countBadge = document.getElementById('listCount');
  const clearBtn  = document.getElementById('clearBtn');

  /* Count how many <li> items are currently in the list */
  const count = list.querySelectorAll('li').length;

  /* Update the count badge text */
  countBadge.textContent = count === 1 ? '1 item' : `${count} items`;

  if (count === 0) {
    /* Show the empty state message */
    emptyMsg.style.display = 'block';
    /* Hide the "Clear All" button */
    clearBtn.style.display  = 'none';
  } else {
    /* Hide the empty state message */
    emptyMsg.style.display = 'none';
    /* Show the "Clear All" button */
    clearBtn.style.display  = 'block';
  }
}
