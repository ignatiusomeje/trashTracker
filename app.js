$(document).ready(function () {
    // Example: Toggle notification bell on click
    $(".notification-icon").on("click", function () {
      alert("You have new notifications!");
    });
  
    // Example: Search bar input
    $(".search-bar").on("input", function () {
      const searchQuery = $(this).val().toLowerCase();
      // Filter recent activities based on search query
      $(".recent-activities li").each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchQuery));
      });
    });
  
    // Category filter dropdown change
    $(".filters select").on("change", function () {
      const selectedCategory = $(this).val();
      // Show all if "All" is selected
      if (selectedCategory === "all") {
        $(".recent-activities li").show();
      } else {
        // Filter based on selected category
        $(".recent-activities li").each(function () {
          const category = $(this).text().toLowerCase();
          $(this).toggle(category.includes(selectedCategory));
        });
      }
    });
  
    // Example: Confirmation on Pickup/Drop-off submit
    $("#confirm-btn").on("click", function () {
      const quantity = $("#quantity").val();
      const category = $("#category").val();
      const datetime = $("#datetime").val();
      if (!quantity || !category || !datetime) {
        alert("Please fill in all fields before confirming.");
      } else {
        alert(`Pickup/Drop-off confirmed: ${quantity}kg of ${category} scheduled for ${datetime}`);
        window.location.href = "index.html"; // Redirect to Home Screen
      }
    });
  
    // Example: Logout functionality
    $("#logout-btn").on("click", function () {
      alert("You have logged out.");
      window.location.href = "index.html"; // Redirect to Home Screen
    });
  });

  