/*global CKEDITOR */
CKEDITOR.plugins.add( 'assetSelector', {
    icons: 'assetSelector',
    init: function( editor ) {
        var $assetModal = $("#assetModal"),
            $selAssets = $("#selAssets"),
            selAssets = $selAssets[0];

        CKEDITOR.dialog.add( 'abbrDialog', this.path + 'dialogs/abbr.js' );

        editor.addCommand( 'assetSelector', {
            exec: function( editor ) {
                $("#lblName").html("None selected");
                $("#lblRevision").html("");
                $("#lblExpiration").html("");
                $("#lblNotes").html("");
                $("#assetImage").html("");

                //$assetModal.off().on('hidden.bs.modal', function () {
                $("#cmdAddAsset").off().click(function () {
                    if (selAssets.value)    {
                        // TODO: Might want to be smarter about adding surrounding spaces.
                        editor.insertHtml(" [[ASSET #" + selAssets.value + "]] ");
                        $assetModal.modal('hide');
                    }   else    {
                        if (window.confirm("No asset was select. Close window?"))    {
                            // TODO: Probably a prettier way to do this.
                            $assetModal.modal('hide');
                        }
                    }
                });

                // TODO: Not sure this has to be a live refresh every
                // time, though that is the safest way of doing this.
                $.get( "./AssetInfo/GetAllAssets/", function(data) {
                    // TODO: Error trapping
                    var i, payload, selValues = {};

                    payload = JSON.parse(data);
                    selAssets.options.length = 0;
                    for (i=0; i<payload.length; i++)
                    {
                        selAssets.options[selAssets.options.length] =
                            new Option(payload[i].name, payload[i].id);

                        selValues[payload[i].id] = payload[i];
                    }

                    $selAssets.off().on('change', function () {
                        var assetInfo;

                        // optSelected = $("option:selected", this);
                        assetInfo = selValues[this.value];

                        // Now write out the values into the asset UI:
                        // TODO: Ensure this stuff exists.
                        $("#lblName").html(assetInfo.name);
                        $("#lblRevision").html(assetInfo.revision);
                        $("#lblExpiration").html(assetInfo.expiration);
                        $("#lblNotes").html(assetInfo.notes);

                        $("#assetImage").html("<img src='" + assetInfo.imageLocation + "'>");
                    });

                    $assetModal.modal();
                });
            }
        });

        //editor.addCommand( 'assetSelector', new CKEDITOR.dialogCommand( 'abbrDialog' ) );

        editor.ui.addButton( 'AssetSelector', {
            label: 'Select Asset',
            command: 'assetSelector',
            toolbar: 'insert,100'
        });
    }
});