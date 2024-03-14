/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Пустой элемент");
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = document.querySelector(".remove-account");
    const removeTransactionBtn = document.querySelector(".transaction__remove");

    removeAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    if (removeTransactionBtn) {
      removeTransactionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(removeTransactionBtn.dataset.id);
        this.removeTransaction(removeTransactionBtn.dataset.id);
      });
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    Account.remove(this.lastOptions.account_id, (err, response) => {
      if (response.success) {
        let confirm = confirm('Вы действительно хотите удалить счёт?');
        if (!confirm) {
          return;
        } else {
        App.updateWidgets();
        App.updateForms();
        this.clear();
        }
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (response.success) {
      let confirm = confirm('Вы действительно хотите удалить эту транзакцию?');
      if (!confirm) {
        return;
      } else {
          Transaction.remove(id, (err, response) => {
          App.update();
      });
    }
  }
}

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }
    this.lastOptions = options;
    Account.get(this.lastOptions.account_id, (err, response) => {
      if (response.success) {
        renderTitle(response.data.name);
      }
    });
    Transaction.list(options, (err, response) => {
      if (response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счета");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = document.querySelector(".content-title");
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const fullDate = new Date(date);
    const options = { dateStyle: "long", timeStyle: "short" };
    const formatedDate = new Intl.DateTimeFormat("ru-RU", options).format(
      fullDate
    );

    return formatedDate.split(",").join(" в ");
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
    <div class="transaction transaction_${item.type} row">
  <div class="col-md-7 transaction__details">
    <div class="transaction__icon">
        <span class="fa fa-money fa-2x"></span>
    </div>
    <div class="transaction__info">
        <h4 class="transaction__title">${item.name}</h4>
        <!-- дата -->
        <div class="transaction__date">${this.formatDate(
          item.created_at
        )}</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="transaction__summ">
    <!--  сумма -->
        ${item.sum}<span class="currency">₽</span>
    </div>
  </div>
  <div class="col-md-2 transaction__controls">
      <!-- в data-id нужно поместить id -->
      <button class="btn btn-danger transaction__remove" data-id="${
        item.id
      }">
          <i class="fa fa-trash"></i>
      </button>
  </div>
</div>
  `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let collectHTML = "";

    data.forEach((item) => {
      collectHTML += this.getTransactionHTML(item);
    });

    document.querySelector(".content").innerHTML = collectHTML;
  }
}
