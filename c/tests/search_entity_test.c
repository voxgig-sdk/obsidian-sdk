// Generated instance test for the search entity.

#include "ctest.h"

int main(void) {
  ObsidianSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = obsidian_search(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "search", "entity get_name");

  TEST_SUMMARY("search_entity");
}
