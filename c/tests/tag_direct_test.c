// Generated direct-call test for the tag entity (mirrors the
// rust TestDirect generator; unit mode uses a mock system.fetch transport).

#include "ctest.h"

#include <stdlib.h>
#include <string.h>

static int CALLS = 0;
static char LAST_URL[1024];

// Mock transport: records the call, returns 200 + the ud response as json.
static voxgig_value* tag_mock(void* ud, voxgig_value* args) {
  CALLS++;
  voxgig_value* url = voxgig_getelem(args, v_int(0), NULL);
  if (voxgig_is_string(url)) {
    snprintf(LAST_URL, sizeof(LAST_URL), "%s", voxgig_as_string(url));
  }
  voxgig_value* data = (voxgig_value*)ud;
  return cmap(4,
    "status", v_num(200),
    "statusText", v_str("OK"),
    "headers", v_map(),
    "json", json_thunk(data));
}

static ObsidianSDK* tag_direct_setup(voxgig_value* mockres) {
  voxgig_value* opts = cmap(2,
    "base", v_str("http://localhost:8080"),
    "system", cmap(1, "fetch", vfn(tag_mock, mockres)));
  return obsidian_sdk_new(opts);
}

int main(void) {

  // LIST
  {
    CALLS = 0;
    voxgig_value* mockres = clist(2,
      cmap(1, "id", v_str("direct01")),
      cmap(1, "id", v_str("direct02")));
    ObsidianSDK* sdk = tag_direct_setup(mockres);
    voxgig_value* params = v_map();
    PNError* err = NULL;
    voxgig_value* result = sdk_direct(sdk, cmap(3,
      "path", v_str("tags"),
      "method", v_str("GET"),
      "params", params), &err);
    CHECK(err == NULL, "list: no error");
    voxgig_value* okv = getp(result, "ok");
    CHECK(voxgig_is_bool(okv) && voxgig_as_bool(okv), "list: ok true");
    CHECK_INT_EQ(to_int(getp(result, "status")), 200, "list: status 200");
    voxgig_value* data = getp(result, "data");
    CHECK(voxgig_is_list(data), "list: data is array");
    CHECK_INT_EQ(voxgig_size(data), 2, "list: 2 items");
    CHECK_INT_EQ(CALLS, 1, "list: one call");
  }

  TEST_SUMMARY("obsidian_tag_direct");
}
