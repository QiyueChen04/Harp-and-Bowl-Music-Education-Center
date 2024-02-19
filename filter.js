import wixData from 'wix-data';

$w.onReady(function() {
    $w('#ageDropdown, #levelDropdown, #genreDropdown, #sortDropdown').onChange(function() {
        search();
    });

    $w('#nameDropdown').onChange(function() {
        $w('#searchBar').value = "";

        $w('#ageDropdown').value = "none";
        $w('#levelDropdown').value = "none";
        $w('#genreDropdown').value = "none";

        $w('#sortDropdown').value = "none";

        search();
    });

    $w("#searchBar").onKeyPress(function (event) {
        if(event.key === "Enter") {
            resetDropdowns();
            search();
        }
        else if(event.key === "Backspace" && $w('#searchBar').value === "") {
            reset();
        }
    });

    $w('#resetFilters').onClick(function() {
        reset();
    });

    $w('#pagination').onChange(function() {
        $w("#anchor").scrollTo();
    });

    async function search() {
        let searchFilter = wixData.filter();
        if($w('#searchBar').value != "") {
            searchFilter = wixData.filter().contains("studentName", $w('#searchBar').value)
                        .or(wixData.filter().contains("title", $w('#searchBar').value));
        }

        let nameFilter = wixData.filter();
        if($w('#nameDropdown').value != "无") {
            let stuName = $w('#nameDropdown').value;
            nameFilter = wixData.filter().contains("studentName", stuName.substring(0, stuName.length - 4));
        }

        let ageFilter = wixData.filter();
        if(($w('#ageDropdown').value) != "none") {
            ageFilter = wixData.filter().contains("studentAge", $w('#ageDropdown').value);
        }

        let levelFilter = wixData.filter();
        if(($w('#levelDropdown').value) != "none") {
            levelFilter = wixData.filter().contains("level", $w('#levelDropdown').value);
        }

        let genreFilter = wixData.filter();
        if($w('#genreDropdown').value != "none") {
            genreFilter = wixData.filter().contains("genre", $w('#genreDropdown').value);
        }

        let sortFilter = wixData.sort();
        if($w('#sortDropdown').value != "none") {
            let sortType = $w('#sortDropdown').value;
            
            if(sortType === "曲目名字") {
                sortFilter = wixData.sort()
                    .ascending("titleSort");
            }
            else if (sortType === "受欢迎程度") {
                sortFilter = wixData.sort()
                    .descending("popularity");
            }
            else  {
                sortFilter = wixData.sort()
                    .descending("date");
            }
        }

        await $w("#pieceDataset").setFilter(searchFilter.and(nameFilter).and(ageFilter).and(levelFilter).and(genreFilter));
        $w('#pieceDataset').setSort(sortFilter);
        count();
    }

    async function reset() {
        await $w('#pieceDataset').setSort(wixData.sort());
        await $w('#pieceDataset').setFilter(wixData.filter());
        count();

        $w('#searchBar').value = "";
        resetDropdowns();
    }

    function resetDropdowns() {
        $w('#nameDropdown').value = "无";
        $w('#ageDropdown').value = "none";
        $w('#levelDropdown').value = "none";
        $w('#genreDropdown').value = "none";

        $w('#sortDropdown').value = "none";
    }

    function count() {
        let resultCount = $w("#pieceDataset").getTotalCount();
        if (resultCount > 0) {
            $w("#counter").text = String(resultCount) + "个作品";
        } else { $w("#counter").text = "没有作品"; }
    }
});
