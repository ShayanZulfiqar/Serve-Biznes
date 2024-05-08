var gUrgency = "";
$(document).on("change", "#urgency,.urgency", function () {
  gUrgency = $(this).val();
});
var CURRENT_FORM = "";
$(document).on("click", "form", "select", function () {
  CURRENT_FORM = $(this);
});
if (typeof jsonOrderData == "undefined") jsonOrderData = {};
function changeurgency_order(doc_id, urgency) {
  if (gUrgency != "" && !urgency) {
    urgency = gUrgency;
  }
  if (urgency == "") {
    urgency = urgency_select;
  }
  if (jsonOrderData.urgency) {
    urgency = jsonOrderData.urgency;
  }
  var form = new FormData();
  form.append("assignment_id", doc_id);
  form.append("urgency", urgency);
  form.append("type", "web");
  if (doc_id == "") {
    return false;
  }
  fetch(cpanel_url + "api/get_urgency", {
    method: "POST",
    body: form,
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (a) {
      $("#urgency,.urgency", CURRENT_FORM).parent().show();
      $("#urgency,.urgency", CURRENT_FORM).html(a);
      $("#urgency_lode").html("");
      price_calculater_order();
    });
}
function ass_select(ass_id, group_unit, group_id, words, w, q) {
  console.log("ass_select");
  $(".error").remove();
  $(":input").css("border-bottom", "");
  $("#wait").css("display", "block");
  $(".overlays_ajax").css("display", "block");
  $("#assignment,.assignment", CURRENT_FORM).val(ass_id);
  $("#group_unit_hidden,.group_unit_hidden", CURRENT_FORM).val(group_unit);
  $(".orderform input[name=assignment_subject_nm]")
    .removeAttr("id")
    .addClass("assignment_subject_nm");
  $(".orderform .chosen-select")
    .removeAttr("id")
    .addClass("assignment_subject");
  $(".orderform .assignment_subject").css("color", "rgb(29, 29, 29)");
  $(".assignment_subject_nm").val(
    $(".assignment_subject option:selected").text().trim()
  );
  var pages_count_slected = $("#pages_count,.pages_count", CURRENT_FORM).val();
  if (pages_count_slected == null || pages_count_slected == "") {
    pages_count_slected = pages_null;
  }
  if (group_id == 4) {
    var no_of_q = $("#no_of_q,.no_of_q", CURRENT_FORM).val();
    var no_of_w = $("#no_of_w,.no_of_w", CURRENT_FORM).val();
    if (no_of_q != "" && no_of_w != "") {
      var pages_count_slected = Math.ceil((no_of_q * no_of_w) / words);
      pages_count_slected = exact_page_count_get(pages_count_slected);
      $("#pages_count,.pages_count", CURRENT_FORM).val(pages_count_slected);
    } else {
      pages_count_slected = 1;
      $("#pages_count,.pages_count", CURRENT_FORM).val(pages_count_slected);
      if (("#no_of_q,.no_of_q", CURRENT_FORM).val() == "") {
        $("#no_of_q,.no_of_q", CURRENT_FORM).val(w);
      }
      if (("#no_of_w,.no_of_w", CURRENT_FORM).val() == "") {
        $("#no_of_w,.no_of_w", CURRENT_FORM).val(q);
      }
      var no_of_q_t = $(
        "#no_of_q,.no_of_q option:selected",
        CURRENT_FORM
      ).text();
      var no_of_q_w = $(
        "#no_of_w,.no_of_w option:selected",
        CURRENT_FORM
      ).text();
    }
    $("#q_w_calcu,.q_w_calcu", CURRENT_FORM).show();
    $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
  } else {
    if (group_id != 11) {
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).show();
    }
    $("#q_w_calcu,.q_w_calcu", CURRENT_FORM).hide();
    if (pages_count_slected == "") {
      pages_count_slected = "";
      if (group_id == 11) {
        $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
        pages_count_slected = 1;
      }
      $("#pages_count,.pages_count", CURRENT_FORM).val(pages_count_slected);
    }
  }
  if (typeof webshortname != "undefined" && webshortname == "IAH_AU") {
    $("#assignment_subject,.assignment_subject", CURRENT_FORM).css("color", "");
    $("#pages_count,.pages_count", CURRENT_FORM).css("color", "");
  } else if (
    typeof webshortname != "undefined" &&
    (webshortname == "GAH_AU" || webshortname == "GAH")
  ) {
    $("#assignment_subject, #assignment_subject", CURRENT_FORM).css(
      "color",
      "rgb(29, 29, 29)"
    );
    $("#pages_count,.pages_count", CURRENT_FORM).css(
      "color",
      "rgb(29, 29, 29)"
    );
  } else {
    $("#assignment_subject, #assignment_subject", CURRENT_FORM).css(
      "color",
      "rgb(29, 29, 29)"
    );
  }
  var pages_count_txt = $(
    "#pages_count,.pages_count option:selected",
    CURRENT_FORM
  ).text();
  changewords_order(group_unit, ass_id, pages_count_slected, urgency_select);
}
function changewords_order(group_unit, ass_id, p_cnt_sle) {
  console.log("changewords_order");
  var g_arr = group_unit.split("|");
  $("#lable_word").html(g_arr[0]);
  var sle = '<option value="" disabled>Select</option>';
  if (jsonOrderData.pages) p_cnt_sle = jsonOrderData.pages;
  var respages = JSON.parse(result_no_of_pages);
  $.each(respages, function (key, val) {
    var u_sec = "";
    if (g_arr.length > 1) {
      u_sec = " / " + val * words + g_arr[1];
    }
    var slected = "",
      no_of_pages = val,
      pages = g_arr[0];
    if (no_of_pages == 1) {
      var pages = g_arr[0];
      if (pages.trim() == "Pages") {
        pages = "Page";
      } else if (pages.trim() == "Slides") {
        pages = "Slide";
      }
    }
    if (pages == "Poster") {
      pages = "Pages / " + pages;
    }
    if (pages == "Leaflet") {
      pages = "Pages / " + pages;
    }
    if (p_cnt_sle) {
      if (no_of_pages == p_cnt_sle) {
        slected = "selected";
      }
    }
    sle +=
      '<option value="' +
      val +
      '" ' +
      slected +
      " > " +
      val +
      " " +
      pages +
      " " +
      u_sec +
      " </option>";
  });
  $("#pages_count,.pages_count", CURRENT_FORM).html(sle);
  var c = $("#pages_count,.pages_count option:selected", CURRENT_FORM).text(),
    dayslise_get = dayslise_get_value,
    urgency = $("#urgency,.urgency", CURRENT_FORM).val();
  if (urgency == "") {
    if (dayslise_get == "") {
      urgency = "";
    } else {
      urgency = dayslise_get;
    }
  }
  if (caclu_type == 1) {
    price_calculater();
  } else {
    changeurgency_order(ass_id, urgency, 1);
  }
}
function show_calculated_price(price, curr, res) {
  if (!res) res = globalRes;
  if (!res.totalprice_custom) return false;
  $("#amountWarning").show();
  if (curr == "USD") $("#amountWarning").hide();
  $("#order_currency").val(curr);
  $("#current_value").val(price);
  $(".basePrice", CURRENT_FORM).html(
    curr + " " + (res.totalprice_custom * price).toFixed(2)
  );
  $(".offerPrice", CURRENT_FORM).html(
    curr + " " + (res.totalprice * price).toFixed(2)
  );
  $(".discountAmount").html(
    curr + " " + (res.discountPrice * price).toFixed(2)
  );
  $(".turnitinReport").html(curr + " ");
  turnitin_free_amount(price, curr, (res.discountPrice * price).toFixed(2));
  if (
    typeof webshortname != "undefined" &&
    (webshortname == "IAH_AU" || webshortname == "AP" || webshortname == "AD")
  ) {
    console.log(curr);
    $("#change_symbol").html(curr);
    $(".offerPrice", CURRENT_FORM).html((res.totalprice * price).toFixed(2));
  }
  if (
    webshortname == "AD" &&
    location.href == "https://www.assignmentdesk.co.uk/pricing"
  ) {
    $(".offerPrice").html((res.totalprice * price).toFixed(2));
    $(".basePrice").html(
      curr + " " + (res.totalprice_custom * price).toFixed(2)
    );
  }
  $(".discountPopup,.total-cashbck").hide();
  $(".hideOncoupon").show();
  cashbackAmt = 0;
  if (res.couponDiscountType) {
    $(".hideOncoupon").hide();
    $(".discountPopup").show();
    $(".offerDiscountDisplay").html(
      curr + " " + (res.discountPrice * price).toFixed(2)
    );
    $(".couponDiscountDisplay").html(
      curr + " " + (res.couponDiscount * price).toFixed(2)
    );
    afterCouponAmt = res.totalprice;
    res.discountPrice += res.couponDiscount;
    res.totalprice -= res.couponDiscount;
    currentCost = res.totalprice;
    calDiscountPer = ((afterCouponAmt - currentCost) / afterCouponAmt) * 100;
    $(".couponDiscountPercentage").html(
      "Coupon Discount (" + calDiscountPer.toFixed() + "%)"
    );
    $(".totalDiscountDisplay").html(
      curr + " " + (res.discountPrice * price).toFixed(2)
    );
  }
  finalBasePrice = (res.totalprice_custom * price).toFixed(2);
  finalOfferPrice = (res.totalprice * price).toFixed(2);
  finalDiscountAmount = (res.discountPrice * price).toFixed(2);
  $(".basePrice", CURRENT_FORM).html(curr + " " + finalBasePrice);
  $(".offerPrice", CURRENT_FORM).html(+finalOfferPrice);
  $(".discountAmount").html(curr + " " + finalDiscountAmount);
  $(".turnitinReport").html(curr + " ");
  turnitin_free_amount(
    price,
    curr,
    parseFloat(finalDiscountAmount) + parseFloat(cashbackAmt)
  );
}
globalRes = {};
function price_calculater_order() {
  service = $("#ass_group_list,.ass_group_list", CURRENT_FORM).val();
  if (service == "") {
    return false;
  }
  $(".file-type-error").hide();
  if (typeof custom_discount != "undefined")
    $(".off", CURRENT_FORM).html(custom_discount + "% Off");
  console.log("price_calculater_order");
  right_cal = $("#right_cal").val();
  if (right_cal == "order_now") {
  }
  addonprice = $(
    "#assignment_subject option:selected,.assignment_subject option:selected",
    CURRENT_FORM
  ).data("addonprice");
  group_id = $(
    "#ass_group_list option:selected,.ass_group_list option:selected",
    CURRENT_FORM
  ).val();
  assignment = $("#assignment,.assignment", CURRENT_FORM).val();
  if (addonprice != "" || addonprice == 0) {
    $(".error").hide();
    $("#assignment_subject,.assignment_subject", CURRENT_FORM).css(
      "border-bottom",
      ""
    );
  }
  page = $("#pages_count,.pages_count", CURRENT_FORM).val();
  if (page == "" || page == null || page == undefined) {
    $('select[name=pages] option[value="1"]').attr("selected", "selected");
    $("#pages_count").val("1");
    if (typeof webshortname != "undefined" && webshortname != "IAH_AU") {
      $("#pages_count,.pages_count", CURRENT_FORM).css(
        "color",
        "rgb(29, 29, 29)"
      );
    }
    page = 1;
  }
  groupIds = [8, 9, 10, 6, 7, 11];
  if (
    (urgency == "" || $.inArray(parseInt(group_id), groupIds) != -1) &&
    !jsonOrderData.urgency
  ) {
    $(
      "#urgency option:last-child,.urgency option:last-child",
      CURRENT_FORM
    ).attr("selected", "selected");
    $("#urgency,.urgency", CURRENT_FORM).css("color", "rgb(29, 29, 29)");
    if (urgency.trim() == "") {
      urgency = $(
        "#urgency option:last-child,.urgency option:last-child",
        CURRENT_FORM
      ).val();
    }
  }
  currencies = $("input[name=currency]").val();
  console.log(currencies);
  if (currencies == "" || currencies == undefined) {
    currencies = 1;
  }
  urgency = $("#urgency,.urgency", CURRENT_FORM).val();
  if (urgency == undefined || urgency.trim() == "") {
    urgency = $(
      "#urgency option:last-child,.urgency option:last-child",
      CURRENT_FORM
    ).val();
    $(
      "#urgency option:last-child,.urgency option:last-child",
      CURRENT_FORM
    ).prop("selected", true);
  }
  lavel = $("#lavel").val();
  root_url1 = $("#root_url").val();
  if (group_id == 11) {
    $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
  }
  console.log(
    assignment,
    "assignment_id=",
    group_id,
    "pages=",
    page,
    "currency=",
    currencies,
    "urgency=",
    urgency
  );
  if (
    assignment == "" ||
    group_id == undefined ||
    group_id == "" ||
    page == "" ||
    currencies == "" ||
    urgency == undefined ||
    urgency == ""
  ) {
    if ($("#Orderform").length) {
    }
    setOrderSummaryZero();
    return false;
  }
  if (
    location.href != "https://www.globalassignmenthelp.com.au/assignment-help"
  ) {
    d_service = $("#ass_group_list option:selected", CURRENT_FORM).text();
    if (d_service == "Editing | Proofreading") {
      $(".subject_list", CURRENT_FORM).hide();
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#urgency_drop").css("width", "100%");
      $(".urgency_label").show();
      $("#urgency_drop").show();
      $(".upload_file_box", CURRENT_FORM).show();
    }
    if (d_service == "Personal Statement") {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $(".sub_label", CURRENT_FORM).hide();
      $("#urgency_drop").css("width", "100%");
      $(".urgency_label").show();
      $("#urgency_drop").show();
    }
    if (
      d_service == "Paraphrasing" ||
      d_service == "Summary Writing" ||
      d_service == "Portfolio"
    ) {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $(".sub_label", CURRENT_FORM).hide();
      $("#get_pages,.get_pages", CURRENT_FORM).show();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).show();
      $("#urgency_drop").show();
    }
    if (d_service == "Online Exam | Question based test Papers") {
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#get_subject").show();
      if (webshortname != "GAH_AU") {
        $("#get_subject").addClass("online-exam");
      }
      if (location.href.indexOf("assignment-help") > "-1") {
      } else {
        $("#pages_count_parent").addClass("online-exam");
        $("#urgency_drop").addClass("online-exam");
        $("#hide_resume").addClass("online-exam");
        $("#hide_urgency").addClass("online-exam");
      }
    }
    if (d_service == "Resume / CV Services") {
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#get_subject,.get_subject", CURRENT_FORM).show();
      $(".sub_label", CURRENT_FORM).show();
      $("#urgency_drop").css("width", "100%");
      $("#urgency_drop").show();
    }
    if ($.inArray(d_service, ["Plagiarism Report"]) != "-1") {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#urgency_drop").css("width", "100%");
      $(".urgency_label").show();
      $("#urgency_drop").show();
      $(".upload_file_box", CURRENT_FORM).show();
    }
    if (
      $.inArray(service, [
        "Assignment",
        "Coursework",
        "Homework",
        "Term Paper",
        "Research Paper",
        "Research Proposal",
        "Case Study",
        "Report Writing",
        "Dissertation",
        "PHD Thesis",
        "Dissertation Proposal",
        "Business Plan",
        "Essay",
        "Multiple Choice Questions",
      ]) != "-1"
    ) {
      $(".urgency_label").hide();
      $("#get_subject,.get_subject", CURRENT_FORM).show();
    }
  } else {
    d_service = $(
      "#ass_group_list option:selected, .ass_group_list option:selected",
      CURRENT_FORM
    ).text();
    if (
      d_service == "Editing | Proofreading" &&
      $("#filewords", CURRENT_FORM).val() == ""
    ) {
      $(".subject_list", CURRENT_FORM).hide();
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $(".urgency_label").show();
      $(".upload_file_box", CURRENT_FORM).show();
    }
    if (d_service == "Personal Statement") {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $(".sub_label", CURRENT_FORM).hide();
      $(".urgency_label").show();
    }
    if (
      d_service == "Paraphrasing" ||
      d_service == "Summary Writing" ||
      d_service == "Portfolio"
    ) {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $(".sub_label", CURRENT_FORM).hide();
      $("#get_pages,.get_pages", CURRENT_FORM).show();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).show();
      $("#urgency_drop").css("width", "100%");
    }
    if (d_service == "Online Exam | Question based test Papers") {
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#get_subject").show();
      if (webshortname != "GAH_AU") {
        $("#get_subject").addClass("online-exam");
      }
      if (location.href.indexOf("assignment-help") > "-1") {
      } else {
        $("#pages_count_parent").addClass("online-exam");
        $("#urgency_drop").addClass("online-exam");
        $("#hide_resume").addClass("online-exam");
        $("#hide_urgency").addClass("online-exam");
      }
    }
    if (d_service == "Resume / CV Services") {
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#get_subject,.get_subject", CURRENT_FORM).show();
      $(".sub_label", CURRENT_FORM).show();
      $("#urgency_drop").css("width", "100%");
    }
    if (
      $.inArray(d_service, ["Plagiarism Report"]) != "-1" &&
      $("#filewords", CURRENT_FORM).val() == ""
    ) {
      $("#get_subject,.get_subject", CURRENT_FORM).hide();
      $(".subject_list", CURRENT_FORM).hide();
      $("#pages_count_parent,.pages_count_parent", CURRENT_FORM).hide();
      $("#urgency_drop").css("width", "");
      $(".urgency_label").show();
      $(".upload_file_box", CURRENT_FORM).show();
    }
    if (
      $.inArray(service, [
        "Assignment",
        "Coursework",
        "Homework",
        "Term Paper",
        "Research Paper",
        "Research Proposal",
        "Case Study",
        "Report Writing",
        "Dissertation",
        "PHD Thesis",
        "Dissertation Proposal",
        "Business Plan",
        "Essay",
        "Multiple Choice Questions",
      ]) != "-1"
    ) {
      $(".urgency_label").hide();
      $("#get_subject,.get_subject", CURRENT_FORM).show();
    }
    if (
      $.inArray(service, ["PowerPoint Presentation", "Leaflet", "Poster"]) !=
      "-1"
    ) {
      $("#urgency_drop").css("width", "100%");
    }
  }
  var form = new FormData();
  form.append(
    "assignment_id",
    $("#assignment,.assignment", CURRENT_FORM).val()
  );
  form.append("currencies", currencies);
  if (
    d_service == "Editing | Proofreading" ||
    d_service == "Plagiarism Report"
  ) {
    if ($("#filewords", CURRENT_FORM).val() == 0) {
      form.append(
        "filewords",
        $("#pages_count,.pages_count", CURRENT_FORM).val() * 250
      );
      $("#units").val(
        $("#pages_count,.pages_count", CURRENT_FORM).val() +
          " Pages / " +
          $("#pages_count,.pages_count", CURRENT_FORM).val() * 250 +
          " Words"
      );
    } else {
      form.append("filewords", $("#filewords", CURRENT_FORM).val());
    }
  }
  form.append("ser_adv_op", "Basic");
  form.append("site_name", webshortname);
  form.append("display_service", $("#ass_group_list option:selected").text());
  form.append("page", page);
  if (
    d_service == "Plagiarism Report" ||
    d_service == "Editing | Proofreading"
  ) {
    form.append("words", $("#words", CURRENT_FORM).val());
  } else {
    form.append(
      "words",
      $("#pages_count,.pages_count", CURRENT_FORM).val() * 250
    );
  }
  form.append("addonprice", addonprice);
  form.append("urgency", $("#urgency,.urgency", CURRENT_FORM).val());
  form.append("service_group_id", group_id);
  form.append("type", "web");
  if ($("#banner-check").prop("checked") == true) {
    form.append("code", $("#banner-check").val());
    $(".off").html(custom_discount + "%" + " + 25% Off");
  }
  fetch(cpanel_url + "api/price_calculateNew", {
    method: "POST",
    body: form,
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (a) {
      $(".emptyHide").show();
      $("#full-loader").hide();
      if (typeof a != "object") a = JSON.parse(a);
      $("#totalprice_custom").val(a.totalprice_custom);
      $("#totalprice").val(a.totalprice);
      $("#discountPrice").val(a.discountPrice);
      $("#curr_symbole_ajsx").val(a.symbole);
      $("#curr_position").val(a.curr_position);
      $("#symbole").val(a.symbole);
      if (
        d_service == "Plagiarism Report" ||
        d_service == "Editing | Proofreading"
      ) {
        units = $("#units").val();
      } else {
        units = $(
          "#pages_count,.pages_count option:selected",
          CURRENT_FORM
        ).text();
        $("#words,.words", CURRENT_FORM).val(a.words);
      }
      if ($("#ass_group_list").val() == 4) {
        units =
          $(".no_of_q option:selected").text() +
          " / " +
          $(".no_of_w option:selected").text();
      }
      $("#units,.units", CURRENT_FORM).val(units);
      $("#usdAmount").text(a.totalprice);
      var price = $("#currency_values option:selected").val();
      var curr = $("#currency_values option:selected").text();
      if (readCookie("currency_data")) {
        currency_data = JSON.parse(atob(readCookie("currency_data")));
        price = currency_data.currency_value;
        curr = currency_data.order_currency;
      } else {
        price = 1;
        curr = "USD";
      }
      if ($("#currency_values option:selected").length == 0) {
      }
      if (typeof webshortname != "undefined" && webshortname == "IAH_AU") {
      }
      if (webshortname == "GAH") {
        if (d_service == "PowerPoint Presentation") {
          $(".form-page").text(
            $("#pages_count option:selected").val() + " Slide"
          );
        } else {
          $(".form-page").text(
            $("#pages_count option:selected").val() + " Page"
          );
        }
        $(".form-days").text($("#urgency option:selected").text() + "Delivery");
      }
      globalRes = a;
      show_calculated_price(price, curr, a);
      $(".urgency_name").html($("#urgency option:selected").text());
      $("#wait").css("display", "none");
      $(".overlays_ajax").css("display", "none");
      $("#calculator_contain").html(a);
      $("#wait").css("display", "none");
      $(".overlays_ajax").css("display", "none");
    });
}
function show_total() {
  var a = $("#totalprice").val();
  var c = $("#curr_position").val();
  if (a > 0) {
    var b = $("#curr_symbole_ajsx").val();
  } else {
    var b = "";
  }
  $("#totx").html(a),
    "pre" == c
      ? ($(".curr_show_pre").html(b), $(".curr_show_post").html(""))
      : "post" == c &&
        ($(".curr_show_post").html(b), $("#curr_show_pre").html(""));
}
function get_subject_list(d, root_url, assignment_subject_nm) {
  var g_id = $(d).val();
  var unit_tag = $("option:selected", d).attr("unit_tag");
  console.log(d, "test", unit_tag);
  if ($(d).hasClass("ass_group_list")) {
    if (!assignment_subject_nm)
      assignment_subject_nm = $(".ass_group_list option:selected", CURRENT_FORM)
        .text()
        .trim();
  } else {
    if (!assignment_subject_nm)
      assignment_subject_nm = $("#ass_group_list option:selected", CURRENT_FORM)
        .text()
        .trim();
  }
  var assignmentName = $("option:selected", d).text();
  $("#assignment_name,.assignment_name", CURRENT_FORM).val(assignmentName);
  service_group_name = assignment_subject_nm;
  if (jsonOrderData.assignment_subject_nm) {
    service_group_name = jsonOrderData.assignment_subject_nm;
  }
  if (g_id) {
    $("#wait").css("display", "block");
    $(".overlays_ajax").css("display", "block");
    var form = new FormData();
    form.append("g_id", g_id);
    form.append("unit_tag", unit_tag);
    form.append("assignment_subject_nm", assignment_subject_nm);
    form.append("urgency", " ");
    form.append("service_group_id", g_id);
    form.append("service_group_name", service_group_name);
    form.append("type", "web");
    fetch(cpanel_url + "api/get_subjects", {
      method: "POST",
      body: form,
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        $("#get_subject,.get_subject", CURRENT_FORM).html(text);
        unit_tag = $("#ass_group_list,.ass_group_list option:selected").attr(
          "unit_tag"
        );
        if (unit_tag !== undefined) {
          if (unit_tag.trim() == "Que. | Word/Que.") {
            $(".sPage").html(unit_tag);
            $(document)
              .find("#questions")
              .append("<label>Select Urgency</label>");
          } else {
            $(".sPage").html(unit_tag.replace("|", "/").replace(/ /g, ""));
          }
        }
        $(".orderform .assignment_subject").css("color", "rgb(29, 29, 29)");
      });
  }
}
function exact_page_count_get(pages_count_slected) {
  var cc = 0;
  $("#pages_count option,.pages_count option", CURRENT_FORM).each(function () {
    if ($(this).val() >= pages_count_slected && cc == 0) {
      cc = $(this).val();
    }
  });
  if (cc == 0) {
    cc = 1;
  }
  return cc;
}
function caclulate_words(words, d) {
  var no_of_q = $("#no_of_q,.no_of_q", CURRENT_FORM).val();
  var no_of_w = $("#no_of_w,.no_of_w", CURRENT_FORM).val();
  if (no_of_q != "" && no_of_w != "") {
    var pages_count_slected = Math.ceil((no_of_q * no_of_w) / words);
    if (
      pages_count_slected >
      $(
        "#pages_count option:last-child,.pages_count option:last-child",
        CURRENT_FORM
      ).val()
    ) {
      $("#pages_count option:last,.pages_count option:last", CURRENT_FORM).attr(
        "selected",
        "selected"
      );
      pages_count_slected = $(
        "#pages_count option:last-child,.pages_count option:last-child",
        CURRENT_FORM
      ).val();
    } else {
      pages_count_slected = exact_page_count_get(pages_count_slected);
    }
    $("#pages_count,.pages_count", CURRENT_FORM).val(pages_count_slected);
    var ass_id = $(".assignment,#assignment", CURRENT_FORM).val();
    var group_unit = $(
      ".group_unit_hidden,#group_unit_hidden",
      CURRENT_FORM
    ).val();
    if (group_unit != "")
      changewords_order(group_unit, ass_id, pages_count_slected);
  }
}
function turnitin_free_amount(currencies, b, discount) {
  var turnitin_cost = (7.5 * currencies).toFixed(2);
  $(".turnitinReport").html("(" + b + " " + turnitin_cost + ")");
  $("#turntin").val(turnitin_cost);
  var saveAmount = parseFloat(discount) + parseFloat(turnitin_cost);
  $(".saveAmount").html(b + " " + saveAmount.toFixed(2));
}
function show_total_after_turnitun(currencies) {
  var a = $("#totalprice").val(),
    b = $("#curr_symbole_ajsx").val(),
    c = $("#curr_position").val(),
    d = $("#turnitin_report_price").val(),
    e = parseFloat(a) + parseFloat(d);
  e = e.toFixed(2);
  turnitin_free_amount(currencies, b, 1);
  "pre" == c
    ? ((f = b + " " + e), $("#tot_price_after_turnitin").html(f))
    : "post" == c &&
      ((g = e + " " + b), $("#tot_price_after_turnitin").html(g));
}
function setOrderSummaryZero() {
  $(".emptyHide").hide();
  $(".offerPrice").text(static_price);
  $(".basePrice").text("0");
  if ($("input[name=currency]").length > 1) {
    var symbole = $("input[name=currency]").data("symbol");
    if (order_currency) {
      symbole = order_currency;
    }
    $(".basePrice").html(symbole + " 0");
  }
}
$("#ass_group_list,.ass_group_list", CURRENT_FORM).change(function () {
  console.log("#ass_group_list");
  if ($("#ass_group_list,.ass_group_list", CURRENT_FORM).val() == "4 ") {
    no_of_q_len = $("#no_of_q,.no_of_q option", CURRENT_FORM).length;
    if (no_of_q_len < 3) {
      var no_of_q = "";
      for (i = q_default; i < 50; i++) {
        sle_q = "";
        if (question_get == i) {
          sle_q = "selected";
        }
        no_of_q +=
          "<option " + sle_q + " value=" + i + ">" + i + " Questions </option>";
      }
    }
    var no_of_w_len = $("#no_of_w,.no_of_w option", CURRENT_FORM).length;
    if (no_of_w_len < 3) {
      var no_of_w = "";
      w_default = 50;
      for (i = w_default; i < 5000; i) {
        sle_w = "";
        if (words_get == i) {
          sle_w = "selected";
        }
        no_of_w +=
          "<option " +
          sle_w +
          " value=" +
          i +
          ">" +
          i +
          " Words/Question </option>";
        i = i + w_default;
      }
    }
    $("#no_of_q,.no_of_q option", CURRENT_FORM).css("color", "rgb(29, 29, 29)");
    $("#no_of_w,.no_of_w option", CURRENT_FORM).css("color", "rgb(29, 29, 29)");
    $("#no_of_q,.no_of_q option", CURRENT_FORM)
      .html(no_of_q)
      .attr("onchange", caclulate_words(words_get, this));
    $("#no_of_w,.no_of_w option", CURRENT_FORM)
      .html(no_of_w)
      .attr("onchange", caclulate_words(words_get, this));
    $(".calLoadImg").attr("src", $(".calLoadImg").attr("data-src"));
  }
});
var currentTime = new Date();
var currentOffset = currentTime.getTimezoneOffset();
var ISTOffset = 330;
var ISTTime = new Date(
  currentTime.getTime() + (ISTOffset + currentOffset) * 60000
);
var hoursIST = ISTTime.getHours();
var minutesIST = ISTTime.getMinutes();
if (hoursIST < 6) {
  $(document).ajaxStop(function () {
    $(document).find("option[value=60h]").hide();
  });
}
