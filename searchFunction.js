function FilterControllerCategory(t) {
  (this.elements = t),
    (this.controller = []),
    this.elements.each(
      function (t, e) {
        var i;
        $(e).hasClass("ncf-filter-categorie-chip")
          ? ((i = new FilterControllerChip($(e))), (val = $(e).data("value")))
          : $(e).hasClass("ncf-filter-categorie-checkbox")
          ? $(e).hasClass("w-checkbox-input--inputType-custom")
            ? ((i = new FilterControllerWfCheckbox($(e))),
              (val = $(e)
                .parent()
                .find("input[type='checkbox']")
                .first()
                .data("value")))
            : ((i = new FilterControllerCheckbox($(e))),
              (val = $(e).data("value")))
          : console.error(
              "Error: ControllerCategory called with wrong elements!!"
            );
        const r = i,
          n = val;
        (r.onChange = function () {
          this.change(r, n);
        }.bind(this)),
          val in this.controller
            ? this.controller[val].push(r)
            : (this.controller[val] = [r]);
      }.bind(this)
    );
}

(FilterControllerCategory.prototype = {
  constructor: FilterControllerCategory,
  getValue: function () {
    for (k in ((values = []), this.controller))
      this.controller[k][0].getValue() && values.push(k);
    return values;
  },
  setValue: function (t) {
    for (k in this.controller)
      for (c of this.controller[k]) c.setValue(t === k);
  },
  change: function (t, e) {
    for (c of this.controller[e]) c.setValue(t.getValue());
    this.onChange();
  },
  onChange: function () {},
}),

(FilterList.prototype = {
  constructor: FilterList,
  initController: function () {
    for (k of ((search = this.root.find(".ncf-filter-control-search")),
      (order = this.root.find(".ncf-filter-order")),
      order.change(this.update.bind(this)),
      (categorie = this.root.find(
        ".ncf-filter-categorie-checkbox,.ncf-filter-categorie-chip"
      )),
      search.each(
        function (t, e) {
          const i = new FilterControllerSearch($(e));
          this.controller.push(i),
            (this.filterObjects[$(e).data("filter")] = new FilterObject(
              "search",
              $(e).data("filter"),
              i
            ));
        }.bind(this)
      ),
      (keys = []),
      categorie.each(
        function (t, e) {
          $(e).hasClass("w-checkbox-input--inputType-custom")
            ? (key = $(e)
                .parent()
                .find("input[type='checkbox']")
                .first()
                .data("filter"))
            : (key = $(e).data("filter")),
            keys.includes(key) || keys.push(key);
        }.bind(this)
      ),
      keys))
      (ctl = new FilterControllerCategory(
        this.root
          .find(".w-checkbox>*[data-filter='" + k + "']")
          .parent()
          .children(".ncf-filter-categorie-checkbox")
          .add(
            this.root.find(
              ".ncf-filter-categorie-chip[data-filter='" + k + "']"
            )
          )
      )),
        this.controller.push(ctl),
        (this.filterObjects[k] = new FilterObject("equal", k, ctl));
    
    // Add the following lines of code to show items with category 'XX' at all times
    const categoryFilterXX = new FilterControllerCategory(
      this.root.find(".ncf-filter-categorie-checkbox[data-filter='XX']").add(
        this.root.find(".ncf-filter-categorie-chip[data-filter='XX']")
      )
    );
    categoryFilterXX.setValue(true);
    this.controller.push(categoryFilterXX);
    (this.filterObjects['XX'] = new FilterObject("equal", 'XX', categoryFilterXX)),
    // End of added code
    
    for (ct of this.controller)
      ct.onChange = function () {
        this.update();
      }.bind(this);
  },
  // ...
});
