// Generated instance test for the system entity.

#include "ctest.h"

int main(void) {
  ObsidianSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = obsidian_system(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "system", "entity get_name");

  TEST_SUMMARY("system_entity");
}
