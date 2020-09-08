<template>
  <div>
    <!--  ----------------------------------------------------------------------  -->
    <!--  NOTE: Please add the following <META> element to your page <HEAD>.      -->
    <!--  If necessary, please modify the charset parameter to specify the        -->
    <!--  character set of your HTML page.                                        -->
    <!--  ----------------------------------------------------------------------  -->

    <meta HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8" />

    <!--  ----------------------------------------------------------------------  -->
    <!--  NOTE: Please add the following <FORM> element to your page.             -->
    <!--  ----------------------------------------------------------------------  -->

    <form
      action="https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8"
      method="POST"
    >
      <input type="hidden" name="orgid" value="00D4K0000015TIc" />
      <!-- <input type="hidden" name="retURL" value="http://localhost:8080" /> -->

      <!--  ----------------------------------------------------------------------  -->
      <!--  NOTE: These fields are optional debugging elements. Please uncomment    -->
      <!--  these lines if you wish to test in debug mode.                          -->
      <!--  <input type="hidden" name="debug" value=1>                              -->
      <!--  <input type="hidden" name="debugEmail"                                  -->
      <!--  value="jrenzel66@protonmail.com">                                       -->
      <!--  ----------------------------------------------------------------------  -->

      <label for="name">Contact Name</label
      ><input
        id="name"
        maxlength="80"
        name="name"
        size="20"
        type="text"
      /><br />

      <label for="email">Email</label
      ><input
        id="email"
        maxlength="80"
        name="email"
        size="20"
        type="text"
      /><br />

      <label for="phone">Phone</label
      ><input
        id="phone"
        maxlength="40"
        name="phone"
        size="20"
        type="text"
      /><br />

      <label for="subject">Subject</label
      ><input
        id="subject"
        maxlength="80"
        name="subject"
        size="20"
        type="text"
      /><br />

      <label for="description">Description</label
      ><textarea name="description"></textarea><br />

      <label for="reason">Case Reason</label
      ><select id="reason" name="reason"
        ><option value="">--None--</option
        ><option value="Installation">Installation</option>
        <option value="Equipment Complexity">Equipment Complexity</option>
        <option value="Performance">Performance</option>
        <option value="Breakdown">Breakdown</option>
        <option value="Equipment Design">Equipment Design</option>
        <option value="Feedback">Feedback</option>
        <option value="Other">Other</option> </select
      ><br />

      <label for="type">Type</label
      ><select id="type" name="type"
        ><option value="">--None--</option
        ><option value="Mechanical">Mechanical</option>
        <option value="Electrical">Electrical</option>
        <option value="Electronic">Electronic</option>
        <option value="Structural">Structural</option>
        <option value="Other">Other</option> </select
      ><br />

      <label for="company">Company</label
      ><input
        id="company"
        maxlength="80"
        name="company"
        size="20"
        type="text"
      /><br />

      Product:<select
        id="00N4K000001w7UX"
        name="00N4K000001w7UX"
        title="Product"
        ><option value="">--None--</option
        ><option value="GC1040">GC1040</option>
        <option value="GC1060">GC1060</option>
        <option value="GC3020">GC3020</option>
        <option value="GC3040">GC3040</option>
        <option value="GC3060">GC3060</option>
        <option value="GC5020">GC5020</option>
        <option value="GC5040">GC5040</option>
        <option value="GC5060">GC5060</option>
        <option value="GC1020">GC1020</option> </select
      ><br />

      <input type="hidden" id="external" name="external" value="1" /><br />

      <input type="submit" name="submit" />
    </form>
  </div>
</template>

<script>
export default {
  name: "WebToCase"
};
</script>

<style></style>
