// Generated instance test for the active entity.

#include "ctest.h"

int main(void) {
  ObsidianSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = obsidian_active(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "active", "entity get_name");

  TEST_SUMMARY("active_entity");
}
